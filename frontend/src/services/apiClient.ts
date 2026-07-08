import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5218/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Normaliza erros do axios para uma mensagem legível e relança. */
export function handleError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const msg =
      error.response?.data?.mensagem ??
      error.response?.data?.message ??
      error.response?.data ??
      error.message ??
      'Erro desconhecido na API.';
    return new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return error instanceof Error ? error : new Error('Erro inesperado.');
}

export { api };
