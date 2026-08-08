using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.Entities;
using AtivosApi.Domain.Enums;

namespace AtivosApi.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Ativo> Ativos { get; set; }
    public DbSet<Emprestimo> Emprestimos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Usuario configuration
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.NomeCompleto).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(150);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Cpf).IsRequired().HasMaxLength(11);
            entity.HasIndex(u => u.Cpf).IsUnique();
            entity.Property(u => u.SenhaHash).IsRequired();
            entity.Property(u => u.Setor).IsRequired().HasMaxLength(100);
        });

        // Ativo configuration
        modelBuilder.Entity<Ativo>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.CodigoIdentificacao).IsRequired().HasMaxLength(50);
            entity.HasIndex(a => a.CodigoIdentificacao).IsUnique();
            entity.Property(a => a.Equipamento).IsRequired().HasMaxLength(200);
            entity.Property(a => a.Categoria).IsRequired().HasMaxLength(100);
            entity.Property(a => a.Status).IsRequired();
            entity.Property(a => a.IsExcluido).HasDefaultValue(false);

            entity.HasOne(a => a.UsuarioCadastro)
                  .WithMany(u => u.AtivosCadastrados)
                  .HasForeignKey(a => a.UsuarioCadastroId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Emprestimo configuration
        modelBuilder.Entity<Emprestimo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SetorDestino).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DataEmprestimo).IsRequired();

            entity.HasOne(e => e.Ativo)
                  .WithMany(a => a.Emprestimos)
                  .HasForeignKey(e => e.AtivoId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UsuarioSolicitante)
                  .WithMany(u => u.Emprestimos)
                  .HasForeignKey(e => e.UsuarioSolicitanteId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed - usuario admin para testes
        // Senha: 123456 (hash gerado com BCrypt)
        var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        modelBuilder.Entity<Usuario>().HasData(new Usuario
        {
            Id = adminId,
            NomeCompleto = "Administrador TI",
            Email = "admin@corporate.org.br",
            Cpf = "00000000000",
            SenhaHash = "$2a$11$QZh0FZiCpRmQOJ7IQUD.qerGPmEEcsIqaKMgCBjmGrDYiCGHj5K8a", // 123456
            Setor = "TI"
        });
    }
}
