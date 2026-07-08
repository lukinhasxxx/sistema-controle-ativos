import { api, handleError } from './apiClient';

/** Autentica um usuário com e-mail e senha. */
export async function loginUsuario(email: string, senha: string) {
  try {
    const { data } = await api.post('/usuarios/login', { email, senha });
    return data as { id: string; nomeCompleto: string; setor: string };
  } catch (error) {
    throw handleError(error);
  }
}

/** Cadastra um novo usuário. */
export async function cadastrarUsuario(payload: {
  nomeCompleto: string;
  email: string;
  cpf: string;
  senha: string;
  setor: string;
}) {
  try {
    const { data } = await api.post('/usuarios', payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

/** Lista todos os usuários. */
export async function getUsuarios() {
  try {
    const { data } = await api.get<{ id: string; nomeCompleto: string; setor: string }[]>('/usuarios');
    return data;
  } catch (error) {
    throw handleError(error);
  }
}
