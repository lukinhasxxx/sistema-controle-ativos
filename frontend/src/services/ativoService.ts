import { api, handleError } from './apiClient';
import { IAtivo } from '../types';

/** Retorna a lista de ativos. */
export async function getAtivos(incluirExcluidos = false): Promise<IAtivo[]> {
  try {
    const { data } = await api.get<any[]>('/ativos', {
      params: { incluirExcluidos },
    });
    // Mapeia codigoIdentificacao (C#) para codigo (React)
    return data.map((ativo) => ({
      ...ativo,
      codigo: ativo.codigoIdentificacao,
    }));
  } catch (error) {
    throw handleError(error);
  }
}

/** Cadastra um novo ativo. */
export async function cadastrarAtivo(payload: Record<string, any>): Promise<IAtivo> {
  try {
    const usuarioStr = localStorage.getItem('usuarioLogado');
    const usuarioLogado = usuarioStr ? JSON.parse(usuarioStr) : null;

    if (!usuarioLogado || !usuarioLogado.id) {
      throw new Error("Sessão inválida ou usuário não encontrado. Faça login novamente.");
    }

    // Monta o payload estritamente como o C# exige
    const payloadFormatado = {
      codigoIdentificacao: payload.codigo,
      equipamento: payload.equipamento,
      categoria: payload.categoria,
      status: payload.status,
      usuarioCadastroId: usuarioLogado.id
    };

    const { data } = await api.post<any>('/ativos', payloadFormatado);

    // Retorna adaptando para a interface do frontend
    return {
      ...data,
      codigo: data.codigoIdentificacao
    };
  } catch (error) {
    throw handleError(error);
  }
}

/** Edita equipamento e categoria de um ativo. */
export async function editarAtivo(
  id: string,
  payload: { equipamento: string; categoria: string },
): Promise<IAtivo> {
  try {
    const { data } = await api.put<any>(`/ativos/${id}`, payload);
    return {
      ...data,
      codigo: data.codigoIdentificacao,
    };
  } catch (error) {
    throw handleError(error);
  }
}

/** Registra um empréstimo de ativo. */
export async function emprestarAtivo(
  id: string,
  payload: { usuarioSolicitanteId: string; setorDestino: string; observacoes?: string },
): Promise<any> {
  try {
    const { data } = await api.post(`/ativos/${id}/emprestar`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

/** Registra a devolução de um ativo. */
export async function devolverAtivo(id: string): Promise<IAtivo> {
  try {
    const { data } = await api.post<IAtivo>(`/ativos/${id}/devolver`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

/** Exclui (soft-delete) um ativo. */
export async function excluirAtivo(id: string): Promise<void> {
  try {
    await api.delete(`/ativos/${id}`);
  } catch (error) {
    throw handleError(error);
  }
}
