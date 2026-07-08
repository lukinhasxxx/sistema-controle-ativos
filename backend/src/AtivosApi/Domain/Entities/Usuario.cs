namespace AtivosApi.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public string Setor { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<Ativo> AtivosCadastrados { get; set; } = new List<Ativo>();
    public ICollection<Emprestimo> Emprestimos { get; set; } = new List<Emprestimo>();
}
