using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Entities;
using AtivosApi.Domain.Enums;
using AtivosApi.Domain.Interfaces;
using AtivosApi.Infrastructure.Data;

namespace AtivosApi.Domain.Services;

public class AtivoService : IAtivoService
{
    private readonly AppDbContext _context;

    public AtivoService(AppDbContext context)
    {
        _context = context;
    }

    // ---------- Cadastrar ----------
    public async Task<AtivoResponse> CadastrarAtivoAsync(CadastrarAtivoRequest request)
    {
        var ativo = new Ativo
        {
            CodigoIdentificacao = request.CodigoIdentificacao,
            Equipamento = request.Equipamento,
            Categoria = request.Categoria,
            UsuarioCadastroId = request.UsuarioCadastroId,
            Status = StatusAtivo.Disponivel
        };

        _context.Ativos.Add(ativo);
        await _context.SaveChangesAsync();

        return ToResponse(ativo);
    }

    // ---------- Listar ----------
    public async Task<IEnumerable<AtivoResponse>> ListarAtivosAsync(bool incluirExcluidos = false)
    {
        var query = _context.Ativos
            .Include(a => a.UsuarioCadastro)
            .AsQueryable();

        if (!incluirExcluidos)
        {
            query = query.Where(a => !a.IsExcluido);
        }

        var ativos = await query
            .OrderBy(a => a.CodigoIdentificacao)
            .ToListAsync();

        return ativos.Select(ToResponse);
    }

    // ---------- Emprestar ----------
    public async Task<EmprestimoResponse> EmprestarAtivoAsync(Guid ativoId, EmprestarAtivoRequest request)
    {
        var ativo = await _context.Ativos.FindAsync(ativoId)
            ?? throw new KeyNotFoundException($"Ativo com Id '{ativoId}' não encontrado.");

        if (ativo.IsExcluido)
            throw new InvalidOperationException("Não é possível emprestar um ativo excluído.");

        if (ativo.Status != StatusAtivo.Disponivel)
            throw new InvalidOperationException(
                $"O ativo '{ativo.Equipamento}' não está disponível. Status atual: {ativo.Status}.");

        var usuario = await _context.Usuarios.FindAsync(request.UsuarioSolicitanteId)
            ?? throw new KeyNotFoundException($"Usuário com Id '{request.UsuarioSolicitanteId}' não encontrado.");

        // Altera status do ativo
        ativo.Status = StatusAtivo.EmUso;

        // Cria registro de empréstimo
        var emprestimo = new Emprestimo
        {
            AtivoId = ativoId,
            UsuarioSolicitanteId = request.UsuarioSolicitanteId,
            SetorDestino = request.SetorDestino,
            Observacoes = request.Observacoes,
            DataEmprestimo = DateTime.UtcNow
        };

        _context.Emprestimos.Add(emprestimo);
        await _context.SaveChangesAsync();

        return new EmprestimoResponse(
            emprestimo.Id,
            ativo.Id,
            ativo.Equipamento,
            usuario.Id,
            usuario.NomeCompleto,
            emprestimo.SetorDestino,
            emprestimo.DataEmprestimo,
            emprestimo.DataDevolucao,
            emprestimo.Observacoes
        );
    }

    // ---------- Devolver ----------
    public async Task<AtivoResponse> DevolverAtivoAsync(Guid ativoId)
    {
        var ativo = await _context.Ativos.FindAsync(ativoId)
            ?? throw new KeyNotFoundException($"Ativo com Id '{ativoId}' não encontrado.");

        if (ativo.Status != StatusAtivo.EmUso)
            throw new InvalidOperationException(
                $"O ativo '{ativo.Equipamento}' não está em uso. Não é possível registrar devolução.");

        // Busca empréstimo em aberto (sem data de devolução)
        var emprestimo = await _context.Emprestimos
            .Where(e => e.AtivoId == ativoId && e.DataDevolucao == null)
            .OrderByDescending(e => e.DataEmprestimo)
            .FirstOrDefaultAsync()
            ?? throw new InvalidOperationException("Nenhum empréstimo em aberto encontrado para este ativo.");

        ativo.Status = StatusAtivo.Disponivel;
        emprestimo.DataDevolucao = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return ToResponse(ativo);
    }

    // ---------- Excluir (Soft Delete) ----------
    public async Task<bool> ExcluirAtivoAsync(Guid ativoId)
    {
        var ativo = await _context.Ativos.FindAsync(ativoId);

        if (ativo == null || ativo.IsExcluido)
            return false;

        ativo.IsExcluido = true;
        await _context.SaveChangesAsync();

        return true;
    }

    // ---------- Auxiliar ----------
    private static AtivoResponse ToResponse(Ativo ativo) => new(
        ativo.Id,
        ativo.CodigoIdentificacao,
        ativo.Equipamento,
        ativo.Categoria,
        ativo.Status.ToString(),
        ativo.IsExcluido,
        ativo.UsuarioCadastroId,
        ativo.UsuarioCadastro?.Setor ?? "N/A",
        null
    );
}
