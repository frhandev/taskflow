using Microsoft.AspNetCore.DataProtection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;
using Microsoft.AspNetCore.HttpOverrides;
using System.Net;

var builder = WebApplication.CreateBuilder(args);


if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("Frontend", policy =>
        {
            policy
                .WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });
}


builder.Services
    .AddControllersWithViews(options =>
    {
        options.Filters.Add(
            new AutoValidateAntiforgeryTokenAttribute()
        );
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter(
                JsonNamingPolicy.CamelCase
            )
        );
    });

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";

    options.Cookie.Name = "TaskFlow.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;

    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();

builder.Services.AddAuthorization();

builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;

        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;

        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "TaskFlow.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.Path = "/";

    options.Cookie.SecurePolicy =
        builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;

    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
});

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("auth", context =>
        RateLimitPartition.GetFixedWindowLimiter(
         partitionKey: $"{context.Request.Path}:{context.Connection.RemoteIpAddress}",

         factory: _ => new FixedWindowRateLimiterOptions
         {
             PermitLimit = 10,
             Window = TimeSpan.FromMinutes(1),
             QueueLimit = 0,
             AutoReplenishment = true,
         }
        )
    );

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode =
            StatusCodes.Status429TooManyRequests;

        await context.HttpContext.Response.WriteAsJsonAsync(
            new
            {
                message = "Too many requests. Please try again later."
            },
            cancellationToken
        );
    };
});

// Persist cookie encryption keys across container restarts in Production.
// The configured directory must be a mounted, persistent Railway Volume.
var dataProtection = builder.Services.AddDataProtection()
    .SetApplicationName("TaskFlow.Api");

if (builder.Environment.IsProduction())
{
    var keyRingPath = builder.Configuration["DataProtection:KeyRingPath"];

    if (string.IsNullOrWhiteSpace(keyRingPath))
    {
        throw new InvalidOperationException(
            "DataProtection:KeyRingPath must be set in Production.");
    }

    var keyDirectory = new DirectoryInfo(keyRingPath);
    if (!keyDirectory.Exists)
    {
        throw new InvalidOperationException(
            "The Data Protection key directory does not exist. Mount a persistent volume first.");
    }

    dataProtection.PersistKeysToFileSystem(keyDirectory);
}

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedProto;

    options.ForwardLimit = 1;

    // Trust only the configured reverse-proxy networks.
    options.KnownIPNetworks.Clear();

    var trustedNetworks =
        builder.Configuration
            .GetSection("ReverseProxy:TrustedNetworks")
            .Get<string[]>() ?? [];

    foreach (var network in trustedNetworks)
    {
        options.KnownIPNetworks.Add(
            System.Net.IPNetwork.Parse(network)
        );
    }
});

var app = builder.Build();

app.Use(async (context, next) =>
{
    app.Logger.LogInformation(
        "Proxy diagnostic: RemoteIP={RemoteIP}, Proto={Proto}",
        context.Connection.RemoteIpAddress,
        context.Request.Headers["X-Forwarded-Proto"].ToString()
    );

    await next();
});

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
    app.UseCors("Frontend");
}

app.UseRouting();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.Run();

