import { api, handleError } from '../../../api';
import type { LoginRequest, CadastrarUsuarioRequest } from './request';
import type { UsuarioResponse } from './response';

export type { LoginRequest, CadastrarUsuarioRequest } from './request';
export type { UsuarioResponse } from './response';

export async function loginUsuario(email: string, senha: string): Promise<UsuarioResponse> {
  try {
    const { data } = await api.post<UsuarioResponse>('/usuarios/login', { email, senha });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function cadastrarUsuario(payload: CadastrarUsuarioRequest): Promise<UsuarioResponse> {
  try {
    const { data } = await api.post<UsuarioResponse>('/usuarios', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getUsuarios(): Promise<UsuarioResponse[]> {
  try {
    const { data } = await api.get<UsuarioResponse[]>('/usuarios');
    return data;
  } catch (error) {
    throw handleError(error);
  }
}
