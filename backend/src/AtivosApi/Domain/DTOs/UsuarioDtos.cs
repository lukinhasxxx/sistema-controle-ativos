namespace AtivosApi.Domain.DTOs;

public record CadastrarUsuarioRequest
{
    /// <summary>
    /// Nome completo do usuário.
    /// </summary>
    /// <example>João Silva</example>
    public string NomeCompleto { get; init; } = string.Empty;

    /// <summary>
    /// E-mail corporativo do usuário.
    /// </summary>
    /// <example>joao@cejam.org.br</example>
    public string Email { get; init; } = string.Empty;

    /// <summary>
    /// CPF do usuário (apenas números).
    /// </summary>
    /// <example>12345678900</example>
    public string Cpf { get; init; } = string.Empty;

    /// <summary>
    /// Senha de acesso ao sistema.
    /// </summary>
    /// <example>SenhaFort3!</example>
    public string Senha { get; init; } = string.Empty;

    /// <summary>
    /// Setor onde o usuário atua.
    /// </summary>
    /// <example>TI</example>
    public string Setor { get; init; } = string.Empty;
}

public record LoginRequest
{
    /// <summary>
    /// E-mail corporativo do usuário.
    /// </summary>
    /// <example>admin@cejam.org.br</example>
    public string Email { get; init; } = string.Empty;

    /// <summary>
    /// Senha de acesso ao sistema.
    /// </summary>
    /// <example>123456</example>
    public string Senha { get; init; } = string.Empty;
}

public record UsuarioResponse(
    Guid Id,
    string NomeCompleto,
    string Setor
);
