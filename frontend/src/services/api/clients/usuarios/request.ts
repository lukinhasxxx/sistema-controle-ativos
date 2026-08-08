export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CadastrarUsuarioPayload {
  nomeCompleto: string;
  email: string;
  cpf: string;
  senha: string;
  setor: string;
}
