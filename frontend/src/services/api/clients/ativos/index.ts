import { api, handleError } from '../../../api';
import type { CadastrarAtivoPayload, EditarAtivoPayload, EmprestarAtivoPayload } from './request';
import type { AtivoResponseDTO, EmprestimoResponseDTO } from '@/dtos';

export type { CadastrarAtivoPayload, EditarAtivoPayload, EmprestarAtivoPayload } from './request';
export type { AtivoResponseDTO, EmprestimoResponseDTO, StatusAtivoDTO } from '@/dtos';

export async function getAtivos(incluirExcluidos = false): Promise<AtivoResponseDTO[]> {
  try {
    const { data } = await api.get<AtivoResponseDTO[]>('/ativos', {
      params: { incluirExcluidos },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function cadastrarAtivo(payload: CadastrarAtivoPayload): Promise<AtivoResponseDTO> {
  try {
    const { data } = await api.post<AtivoResponseDTO>('/ativos', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function editarAtivo(
  id: string,
  payload: EditarAtivoPayload,
): Promise<AtivoResponseDTO> {
  try {
    const { data } = await api.put<AtivoResponseDTO>(`/ativos/${id}`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function emprestarAtivo(
  id: string,
  payload: EmprestarAtivoPayload,
): Promise<EmprestimoResponseDTO> {
  try {
    const { data } = await api.post<EmprestimoResponseDTO>(`/ativos/${id}/emprestar`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function devolverAtivo(id: string): Promise<AtivoResponseDTO> {
  try {
    const { data } = await api.post<AtivoResponseDTO>(`/ativos/${id}/devolver`);
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
