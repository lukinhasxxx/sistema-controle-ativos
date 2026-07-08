using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Interfaces;

namespace AtivosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Lista todos os usuários do sistema.
    /// </summary>
    /// <returns>Lista de usuários cadastrados.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UsuarioResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar()
    {
        var usuarios = await _usuarioService.ListarUsuariosAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Cadastra um novo usuário no sistema.
    /// </summary>
    /// <param name="request">Dados do usuário a ser cadastrado.</param>
    /// <returns>O usuário recém-cadastrado.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(UsuarioResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Cadastrar([FromBody] CadastrarUsuarioRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var usuario = await _usuarioService.CadastrarUsuarioAsync(request);
            return CreatedAtAction(nameof(Listar), new { id = usuario.Id }, usuario);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { mensagem = "Erro de integridade de dados. Verifique se os IDs existem e se os valores unicos nao estao duplicados." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Autentica um usuário com e-mail e senha.
    /// </summary>
    /// <param name="request">Credenciais de acesso.</param>
    /// <returns>Dados do usuário autenticado.</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(UsuarioResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var usuario = await _usuarioService.LoginAsync(request);

        if (usuario == null)
            return Unauthorized(new { mensagem = "E-mail ou senha inválidos." });

        return Ok(usuario);
    }
}
