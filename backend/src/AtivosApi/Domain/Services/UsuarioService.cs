using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Entities;
using AtivosApi.Domain.Interfaces;
using AtivosApi.Infrastructure.Data;

namespace AtivosApi.Domain.Services;

public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _context;

    public UsuarioService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UsuarioResponse> CadastrarUsuarioAsync(CadastrarUsuarioRequest request)
    {
        var usuario = new Usuario
        {
            NomeCompleto = request.NomeCompleto,
            Email = request.Email,
            Cpf = request.Cpf,
            SenhaHash = request.Senha,
            Setor = request.Setor
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return new UsuarioResponse(usuario.Id, usuario.NomeCompleto, usuario.Setor);
    }

    public async Task<IEnumerable<UsuarioResponse>> ListarUsuariosAsync()
    {
        var usuarios = await _context.Usuarios
            .OrderBy(u => u.NomeCompleto)
            .ToListAsync();

        return usuarios.Select(u => new UsuarioResponse(u.Id, u.NomeCompleto, u.Setor));
    }
}
