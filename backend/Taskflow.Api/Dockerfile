# Railway service root directory: /backend/Taskflow.Api
# Build context must be this directory.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Taskflow.Api.csproj ./
RUN dotnet restore Taskflow.Api.csproj

COPY . ./
RUN dotnet publish Taskflow.Api.csproj -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "Taskflow.Api.dll"]
