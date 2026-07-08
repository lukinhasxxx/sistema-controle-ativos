using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Entities;
using AtivosApi.Domain.Services;
using AtivosApi.Infrastructure.Data;
using Xunit;
using BCrypt.Net;

namespace AtivosApi.Tests.Services;

public class UsuarioServiceTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CadastrarUsuarioAsync_DeveCriarUsuarioComSucesso()
    {
        // Arrange
        var context = GetDbContext();
        var service = new UsuarioService(context);
        var request = new CadastrarUsuarioRequest
        {
            NomeCompleto = "Teste User",
            Email = "teste@example.com",
            Cpf = "12345678901",
            Senha = "senhaforte",
            Setor = "TI"
        };

        // Act
        var response = await service.CadastrarUsuarioAsync(request);

        // Assert
        response.Should().NotBeNull();
        response.NomeCompleto.Should().Be(request.NomeCompleto);

        var userInDb = await context.Usuarios.FindAsync(response.Id);
        userInDb.Should().NotBeNull();
        BCrypt.Net.BCrypt.Verify("senhaforte", userInDb.SenhaHash).Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_DeveRetornarUsuarioQuandoCredenciaisValidas()
    {
        // Arrange
        var context = GetDbContext();
        var service = new UsuarioService(context);
        
        context.Usuarios.Add(new Usuario
        {
            Email = "teste@example.com",
            Cpf = "00000000000",
            NomeCompleto = "User Login",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Setor = "TI"
        });
        await context.SaveChangesAsync();

        var request = new LoginRequest
        {
            Email = "teste@example.com",
            Senha = "senha123"
        };

        // Act
        var response = await service.LoginAsync(request);

        // Assert
        response.Should().NotBeNull();
        response.NomeCompleto.Should().Be("User Login");
    }

    [Fact]
    public async Task LoginAsync_DeveRetornarNuloQuandoSenhaInvalida()
    {
        // Arrange
        var context = GetDbContext();
        var service = new UsuarioService(context);
        
        context.Usuarios.Add(new Usuario
        {
            Email = "teste@example.com",
            Cpf = "00000000000",
            NomeCompleto = "User Login",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword("senha123"),
            Setor = "TI"
        });
        await context.SaveChangesAsync();

        var request = new LoginRequest
        {
            Email = "teste@example.com",
            Senha = "senhaerrada"
        };

        // Act
        var response = await service.LoginAsync(request);

        // Assert
        response.Should().BeNull();
    }
}
