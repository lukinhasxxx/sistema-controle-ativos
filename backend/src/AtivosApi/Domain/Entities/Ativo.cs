using AtivosApi.Domain.Enums;

namespace AtivosApi.Domain.Entities;

public class Ativo
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CodigoIdentificacao { get; set; } = string.Empty;
    public string Equipamento { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public StatusAtivo Status { get; set; } = StatusAtivo.Disponivel;
    public bool IsExcluido { get; set; } = false;

    // Foreign Key
    public Guid UsuarioCadastroId { get; set; }

    // Navigation properties
    public Usuario? UsuarioCadastro { get; set; }
    public ICollection<Emprestimo> Emprestimos { get; set; } = new List<Emprestimo>();
}
