using AtivosApi.Domain.DTOs;

namespace AtivosApi.Domain.Interfaces;

public interface IAtivoService
{
    Task<AtivoResponse> CadastrarAtivoAsync(CadastrarAtivoRequest request);
    Task<AtivoResponse> EditarAtivoAsync(Guid id, EditarAtivoRequest request);
    Task<IEnumerable<AtivoResponse>> ListarAtivosAsync(bool incluirExcluidos = false);
    Task<EmprestimoResponse> EmprestarAtivoAsync(Guid ativoId, EmprestarAtivoRequest request);
    Task<AtivoResponse> DevolverAtivoAsync(Guid ativoId);
    Task<bool> ExcluirAtivoAsync(Guid ativoId);
}
