import axios, { AxiosError } from 'axios';
import { IAtivo } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5218/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Retorna a lista de ativos. */
export async function getAtivos(incluirExcluidos = false): Promise<IAtivo[]> {
  try {
    const { data } = await api.get<IAtivo[]>('/ativos', {
      params: { incluirExcluidos },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

/** Cadastra um novo ativo. */
export async function cadastrarAtivo(payload: Record<string, unknown>): Promise<IAtivo> {
  try {
    const { data } = await api.post<IAtivo>('/ativos', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

/** Registra um empréstimo de ativo. */
export async function emprestarAtivo(
  id: string,
  payload: Record<string, unknown>,
): Promise<IAtivo> {
  try {
    const { data } = await api.post<IAtivo>(`/ativos/${id}/emprestar`, payload);
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

/** Normaliza erros do axios para uma mensagem legível e relança. */
function handleError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const msg =
      error.response?.data?.message ??
      error.response?.data ??
      error.message ??
      'Erro desconhecido na API.';
    return new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return error instanceof Error ? error : new Error('Erro inesperado.');
}
