# Railway service root directory: /backend/Taskflow.Api
# Build context must be this directory.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Taskflow.Api.csproj ./
RUN dotnet restore Taskflow.Api.csproj

COPY . ./
RUN dotnet publish Taskflow.Api.csproj -c Release -o /app/publish --no-restore /p:UseAppHost=false

# Create a framework-dependent EF Core migration bundle at image build time.
# It only creates the executable; it does NOT connect to a production database.
RUN dotnet tool install dotnet-ef --tool-path /tools --version 10.0.12
RUN /tools/dotnet-ef migrations bundle \
    --no-build \
    --configuration Release \
    --output /app/publish/efbundle

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish ./
RUN chmod +x /app/efbundle
ENTRYPOINT ["dotnet", "Taskflow.Api.dll"]
