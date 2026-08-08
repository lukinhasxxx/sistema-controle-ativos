export interface CadastrarAtivoPayload {
  codigoIdentificacao: string;
  equipamento: string;
  categoria: string;
  usuarioCadastroId: string;
}

export interface EditarAtivoPayload {
  equipamento: string;
  categoria: string;
}

export interface EmprestarAtivoPayload {
  usuarioSolicitanteId: string;
  setorDestino: string;
  observacoes?: string;
}
