namespace AtivosApi.Domain.DTOs;

// -------- REQUEST DTOs --------

public record CadastrarAtivoRequest
{
    /// <summary>
    /// Código único de identificação do ativo.
    /// </summary>
    /// <example>MON-001</example>
    public string CodigoIdentificacao { get; init; } = string.Empty;

    /// <summary>
    /// Descrição do equipamento.
    /// </summary>
    /// <example>Monitor Dell 24 polegadas</example>
    public string Equipamento { get; init; } = string.Empty;

    /// <summary>
    /// Categoria do ativo.
    /// </summary>
    /// <example>Monitor</example>
    public string Categoria { get; init; } = string.Empty;

    /// <summary>
    /// ID do usuário responsável pelo cadastro.
    /// </summary>
    /// <example>11111111-1111-1111-1111-111111111111</example>
    public Guid UsuarioCadastroId { get; init; }
}

public record EmprestarAtivoRequest
{
    /// <summary>
    /// ID do usuário que está solicitando o empréstimo.
    /// </summary>
    /// <example>11111111-1111-1111-1111-111111111111</example>
    public Guid UsuarioSolicitanteId { get; init; }

    /// <summary>
    /// Setor para onde o ativo será alocado.
    /// </summary>
    /// <example>Desenvolvimento</example>
    public string SetorDestino { get; init; } = string.Empty;

    /// <summary>
    /// Observações adicionais sobre o empréstimo.
    /// </summary>
    /// <example>Empréstimo temporário para projeto X.</example>
    public string? Observacoes { get; init; }
}

// -------- RESPONSE DTOs --------

public record AtivoResponse(
    Guid Id,
    string CodigoIdentificacao,
    string Equipamento,
    string Categoria,
    string Status,
    bool IsExcluido,
    Guid UsuarioCadastroId,
    string Setor = "",
    string? Responsavel = null
);

public record EmprestimoResponse(
    Guid Id,
    Guid AtivoId,
    string Equipamento,
    Guid UsuarioSolicitanteId,
    string NomeUsuario,
    string SetorDestino,
    DateTime DataEmprestimo,
    DateTime? DataDevolucao,
    string? Observacoes
);
