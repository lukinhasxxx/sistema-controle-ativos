using Microsoft.EntityFrameworkCore;
using AtivosApi.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Serviços serão expandidos nos próximos commits
builder.Services.AddControllers();

// Entity Framework Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapControllers();

app.Run();
