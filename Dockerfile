# Estágio de Build com .NET 9
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . ./
RUN dotnet restore
RUN dotnet publish src/DatabaseOptimization.Api/DatabaseOptimization.Api.csproj -c Release -o out

# Estágio de Execução com .NET 9
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "DatabaseOptimization.Api.dll"]
