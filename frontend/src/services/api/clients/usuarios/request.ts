export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastrarUsuarioRequest {
  nomeCompleto: string;
  email: string;
  cpf: string;
  senha: string;
  setor: string;
}
