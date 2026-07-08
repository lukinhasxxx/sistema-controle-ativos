import axios, { AxiosError } from 'axios';
import { IAtivo } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5218/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Usuários ──────────────────────────────────────────────────────────────────

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

// ── Ativos ────────────────────────────────────────────────────────────────────

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

/** Normaliza erros do axios para uma mensagem legível e relança. */
function handleError(error: unknown): Error {
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
