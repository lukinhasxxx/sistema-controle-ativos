namespace AtivosApi.Domain.Entities;

public class Emprestimo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime DataEmprestimo { get; set; } = DateTime.UtcNow;
    public DateTime? DataDevolucao { get; set; }
    public string SetorDestino { get; set; } = string.Empty;
    public string? Observacoes { get; set; }

    // Foreign Keys
    public Guid AtivoId { get; set; }
    public Guid UsuarioSolicitanteId { get; set; }

    // Navigation properties
    public Ativo? Ativo { get; set; }
    public Usuario? UsuarioSolicitante { get; set; }
}
