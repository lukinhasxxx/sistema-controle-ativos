using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using AtivosApi.Infrastructure.Data;
using AtivosApi.Domain.Interfaces;
using AtivosApi.Domain.Services;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// ===================== SERVICES =====================

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddEndpointsApiExplorer();

// Swagger com documentação enriquecida
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API de Controle de Ativos",
        Version = "v1",
        Description = "API RESTful para gerenciamento de ativos, empréstimos e devoluções",
        Contact = new OpenApiContact
        {
            Name = "ADMIN TI",
            Email = "ti@corporate.org.br"
        }
    });

    // Incluir comentários XML nos endpoints do Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        options.IncludeXmlComments(xmlPath);
});

// Entity Framework Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS - permite requisições do frontend Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Injeção de dependência dos serviços
builder.Services.AddScoped<IAtivoService, AtivoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// ===================== PIPELINE =====================

var app = builder.Build();

// Aplicar migrations e seed automaticamente na inicialização
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Controle de Ativos v1");
    c.RoutePrefix = string.Empty; // Swagger na raiz "/"
});

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
