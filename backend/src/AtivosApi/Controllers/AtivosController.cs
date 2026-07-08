using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AtivosApi.Domain.DTOs;
using AtivosApi.Domain.Interfaces;

namespace AtivosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AtivosController : ControllerBase
{
    private readonly IAtivoService _ativoService;

    public AtivosController(IAtivoService ativoService)
    {
        _ativoService = ativoService;
    }

    /// <summary>
    /// Lista todos os ativos. Permite incluir os excluídos via parâmetro de query.
    /// </summary>
    /// <param name="incluirExcluidos">Quando true, inclui ativos com soft-delete.</param>
    /// <returns>Lista de ativos cadastrados.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<AtivoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar([FromQuery] bool incluirExcluidos = false)
    {
        var ativos = await _ativoService.ListarAtivosAsync(incluirExcluidos);
        return Ok(ativos);
    }

    /// <summary>
    /// Cadastra um novo ativo no sistema.
    /// </summary>
    /// <param name="request">Dados do ativo a ser cadastrado.</param>
    /// <returns>O ativo recém-cadastrado.</returns>
    [HttpPost]
    [ProducesResponseType(typeof(AtivoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Cadastrar([FromBody] CadastrarAtivoRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var ativo = await _ativoService.CadastrarAtivoAsync(request);
            return CreatedAtAction(nameof(Listar), new { id = ativo.Id }, ativo);
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
    /// Realiza o empréstimo de um ativo para um responsável.
    /// Valida se o ativo está Disponível antes de processar.
    /// </summary>
    /// <param name="id">ID do ativo a emprestar.</param>
    /// <param name="request">Dados do empréstimo.</param>
    /// <returns>Detalhes do empréstimo registrado.</returns>
    [HttpPost("{id:guid}/emprestar")]
    [ProducesResponseType(typeof(EmprestimoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Emprestar(Guid id, [FromBody] EmprestarAtivoRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var emprestimo = await _ativoService.EmprestarAtivoAsync(id, request);
            return Ok(emprestimo);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { mensagem = "Erro de integridade de dados. Verifique se os IDs existem e se os valores unicos nao estao duplicados." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Registra a devolução de um ativo em uso, retornando-o para Disponível.
    /// </summary>
    /// <param name="id">ID do ativo a devolver.</param>
    /// <returns>O ativo atualizado.</returns>
    [HttpPost("{id:guid}/devolver")]
    [ProducesResponseType(typeof(AtivoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Devolver(Guid id)
    {
        try
        {
            var ativo = await _ativoService.DevolverAtivoAsync(id);
            return Ok(ativo);
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { mensagem = "Erro de integridade de dados. Verifique se os IDs existem e se os valores unicos nao estao duplicados." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Exclui um ativo de forma lógica (Soft Delete). O registro permanece no banco com IsExcluido = true.
    /// </summary>
    /// <param name="id">ID do ativo a excluir.</param>
    /// <returns>204 No Content em caso de sucesso.</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Excluir(Guid id)
    {
        try
        {
            var resultado = await _ativoService.ExcluirAtivoAsync(id);

            if (!resultado)
                return NotFound(new { mensagem = $"Ativo com Id '{id}' não encontrado ou já excluído." });

            return NoContent();
        }
        catch (DbUpdateException)
        {
            return BadRequest(new { mensagem = "Erro de integridade de dados. Verifique se os IDs existem e se os valores unicos nao estao duplicados." });
        }
    }
}
