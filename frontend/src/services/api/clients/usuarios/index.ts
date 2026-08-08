import { api, handleError } from '../../../api';
import type { LoginPayload, CadastrarUsuarioPayload } from './request';
import type { UsuarioResponseDTO } from '@/dtos';

export type { LoginPayload, CadastrarUsuarioPayload } from './request';
export type { UsuarioResponseDTO } from '@/dtos';

export async function loginUsuario(email: string, senha: string): Promise<UsuarioResponseDTO> {
  try {
    const { data } = await api.post<UsuarioResponseDTO>('/usuarios/login', { email, senha });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function cadastrarUsuario(payload: CadastrarUsuarioPayload): Promise<UsuarioResponseDTO> {
  try {
    const { data } = await api.post<UsuarioResponseDTO>('/usuarios', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getUsuarios(): Promise<UsuarioResponseDTO[]> {
  try {
    const { data } = await api.get<UsuarioResponseDTO[]>('/usuarios');
    return data;
  } catch (error) {
    throw handleError(error);
  }
}
