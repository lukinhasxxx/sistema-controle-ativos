import { api, handleError } from '../../../api';
import type { CadastrarAtivoRequest, EditarAtivoRequest, EmprestarAtivoRequest } from './request';
import type { AtivoResponse, EmprestimoResponse } from './response';

export type { CadastrarAtivoRequest, EditarAtivoRequest, EmprestarAtivoRequest } from './request';
export type { AtivoResponse, EmprestimoResponse, StatusAtivo } from './response';

export async function getAtivos(incluirExcluidos = false): Promise<AtivoResponse[]> {
  try {
    const { data } = await api.get<AtivoResponse[]>('/ativos', {
      params: { incluirExcluidos },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function cadastrarAtivo(payload: CadastrarAtivoRequest): Promise<AtivoResponse> {
  try {
    const { data } = await api.post<AtivoResponse>('/ativos', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function editarAtivo(
  id: string,
  payload: EditarAtivoRequest,
): Promise<AtivoResponse> {
  try {
    const { data } = await api.put<AtivoResponse>(`/ativos/${id}`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function emprestarAtivo(
  id: string,
  payload: EmprestarAtivoRequest,
): Promise<EmprestimoResponse> {
  try {
    const { data } = await api.post<EmprestimoResponse>(`/ativos/${id}/emprestar`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function devolverAtivo(id: string): Promise<AtivoResponse> {
  try {
    const { data } = await api.post<AtivoResponse>(`/ativos/${id}/devolver`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function excluirAtivo(id: string): Promise<void> {
  try {
    await api.delete(`/ativos/${id}`);
  } catch (error) {
    throw handleError(error);
  }
}
