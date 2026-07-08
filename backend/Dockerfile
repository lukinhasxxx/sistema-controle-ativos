# ============================================
# Stage 1 - Build
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o .csproj e restaura dependências (cache de camada)
COPY src/AtivosApi/AtivosApi.csproj src/AtivosApi/
RUN dotnet restore src/AtivosApi/AtivosApi.csproj

# Copia todo o código e publica
COPY src/ src/
RUN dotnet publish src/AtivosApi/AtivosApi.csproj -c Release -o /app/publish --no-restore

# ============================================
# Stage 2 - Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Cria diretório para o banco SQLite (montável como volume)
RUN mkdir -p /app/data

# Copia a aplicação publicada
COPY --from=build /app/publish .

# Variáveis de ambiente
ENV ASPNETCORE_URLS=http://+:5218
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/ativos.db"

EXPOSE 5218

ENTRYPOINT ["dotnet", "AtivosApi.dll"]
