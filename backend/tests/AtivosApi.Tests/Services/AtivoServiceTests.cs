using System;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Entities;
using AtivosApi.Domain.Enums;
using AtivosApi.Domain.Services;
using AtivosApi.Infrastructure.Data;
using Xunit;

namespace AtivosApi.Tests.Services;

public class AtivoServiceTests
{
    private AppDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CadastrarAtivoAsync_DeveCriarAtivoCorretamente()
    {
        // Arrange
        var context = GetDbContext();
        var service = new AtivoService(context);
        
        var request = new CadastrarAtivoRequest
        {
            CodigoIdentificacao = "NOTE-01",
            Equipamento = "Notebook Dell",
            Categoria = "Notebook",
            UsuarioCadastroId = Guid.NewGuid()
        };

        // Act
        var response = await service.CadastrarAtivoAsync(request);

        // Assert
        response.Should().NotBeNull();
        response.CodigoIdentificacao.Should().Be(request.CodigoIdentificacao);
        response.Status.Should().Be("Disponível");
        
        var ativoInDb = await context.Ativos.FindAsync(response.Id);
        ativoInDb.Should().NotBeNull();
        ativoInDb!.Status.Should().Be(StatusAtivo.Disponivel);
    }

    [Fact]
    public async Task EmprestarAtivoAsync_DeveFuncionarQuandoDisponivel()
    {
        // Arrange
        var context = GetDbContext();
        var service = new AtivoService(context);

        var usuario = new Usuario { Id = Guid.NewGuid(), NomeCompleto = "Solicitante", Email = "s@a.com", Cpf = "1", SenhaHash = "a", Setor = "TI" };
        var ativo = new Ativo { Id = Guid.NewGuid(), CodigoIdentificacao = "M-01", Equipamento = "Monitor", Categoria = "Monitor", Status = StatusAtivo.Disponivel };
        
        context.Usuarios.Add(usuario);
        context.Ativos.Add(ativo);
        await context.SaveChangesAsync();

        var request = new EmprestarAtivoRequest
        {
            UsuarioSolicitanteId = usuario.Id,
            SetorDestino = "TI",
            Observacoes = "Projeto X"
        };

        // Act
        var response = await service.EmprestarAtivoAsync(ativo.Id, request);

        // Assert
        response.Should().NotBeNull();
        response.SetorDestino.Should().Be("TI");
        
        var ativoInDb = await context.Ativos.FindAsync(ativo.Id);
        ativoInDb!.Status.Should().Be(StatusAtivo.EmUso);
    }

    [Fact]
    public async Task EmprestarAtivoAsync_DeveFalharQuandoNaoDisponivel()
    {
        // Arrange
        var context = GetDbContext();
        var service = new AtivoService(context);

        var usuario = new Usuario { Id = Guid.NewGuid(), NomeCompleto = "Solicitante", Email = "s@a.com", Cpf = "1", SenhaHash = "a", Setor = "TI" };
        var ativo = new Ativo { Id = Guid.NewGuid(), CodigoIdentificacao = "M-01", Equipamento = "Monitor", Categoria = "Monitor", Status = StatusAtivo.Manutencao };
        
        context.Usuarios.Add(usuario);
        context.Ativos.Add(ativo);
        await context.SaveChangesAsync();

        var request = new EmprestarAtivoRequest
        {
            UsuarioSolicitanteId = usuario.Id,
            SetorDestino = "TI"
        };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() => service.EmprestarAtivoAsync(ativo.Id, request));
        exception.Message.Should().Contain("não está disponível");
    }

    [Fact]
    public async Task DevolverAtivoAsync_DeveRetornarStatusDisponivelEPreencherDataDevolucao()
    {
        // Arrange
        var context = GetDbContext();
        var service = new AtivoService(context);

        var usuario = new Usuario { Id = Guid.NewGuid(), NomeCompleto = "Solicitante", Email = "s@a.com", Cpf = "1", SenhaHash = "a", Setor = "TI" };
        var ativo = new Ativo { Id = Guid.NewGuid(), CodigoIdentificacao = "M-01", Equipamento = "Monitor", Categoria = "Monitor", Status = StatusAtivo.EmUso };
        var emprestimo = new Emprestimo { Id = Guid.NewGuid(), AtivoId = ativo.Id, UsuarioSolicitanteId = usuario.Id, SetorDestino = "TI", DataEmprestimo = DateTime.UtcNow };
        
        context.Usuarios.Add(usuario);
        context.Ativos.Add(ativo);
        context.Emprestimos.Add(emprestimo);
        await context.SaveChangesAsync();

        // Act
        var response = await service.DevolverAtivoAsync(ativo.Id);

        // Assert
        response.Should().NotBeNull();
        response.Status.Should().Be("Disponível");

        var emprestimoInDb = await context.Emprestimos.FindAsync(emprestimo.Id);
        emprestimoInDb!.DataDevolucao.Should().NotBeNull();
    }
}
