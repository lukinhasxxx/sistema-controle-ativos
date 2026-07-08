using AtivosApi.Domain.DTOs;

namespace AtivosApi.Domain.Interfaces;

public interface IUsuarioService
{
    Task<UsuarioResponse> CadastrarUsuarioAsync(CadastrarUsuarioRequest request);
    Task<IEnumerable<UsuarioResponse>> ListarUsuariosAsync();
    Task<UsuarioResponse?> LoginAsync(LoginRequest request);
}
