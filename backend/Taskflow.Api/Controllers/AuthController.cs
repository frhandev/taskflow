

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.DTOs.Auth;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (req.Password != req.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Password do not match"
            });
        }

        var exsistingUser = await _userManager.FindByEmailAsync(req.Email);

        if (exsistingUser != null)
        {
            return BadRequest(new
            {
                message = "An account with this email already exists."
            });
        }

        var user = new ApplicationUser
        {
            UserName = req.Email.Trim(),
            Email = req.Email.Trim()
        };

        var result = await _userManager.CreateAsync(
            user,
            req.Password
        );

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "Registration Failed. ",
                errors = result.Errors
                    .Select(err => err.Description)
                    .ToArray()
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            new AuthUserResponse
            {
                Id = user.Id,
                Email = user.Email
            }
        );
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _userManager.FindByEmailAsync(req.Email.Trim());

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var result = await _signInManager.PasswordSignInAsync(
            user,
            req.Password,
            isPersistent: false,
            lockoutOnFailure: false
        );

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(new AuthUserResponse
        {
            Id = user.Id,
            Email = user.Email!,
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();

        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var user = await _userManager.GetUserAsync(User);

        if(user == null)
        {
            return Unauthorized();
        }

        return Ok(new AuthUserResponse
        {
            Id = user.Id,
            Email = user.Email!,
        });
    }
}