using Microsoft.EntityFrameworkCore;
using DatabaseOptimization.Domain;

var builder = WebApplication.CreateBuilder(args);

// Configuração obrigatória para o Render escutar a porta dinâmica da nuvem
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

// Adiciona política de CORS permissiva para aceitar requisições da Vercel e do ambiente local
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

// Configuração do DbContext apontando para o PostgreSQL
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Host=localhost;Port=5432;Database=performance_db;Username=postgres;Password=password123";
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions => 
    {
        npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null);
    }));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ativa corretamente a política de CORS criada acima
app.UseCors("AllowAll");

// Removido o UseHttpsRedirection para evitar conflito com o proxy reverso do Render

app.UseAuthorization();

app.MapControllers();

app.Run();
