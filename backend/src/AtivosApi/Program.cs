var builder = WebApplication.CreateBuilder(args);

// Serviços serão registrados nos próximos commits
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
