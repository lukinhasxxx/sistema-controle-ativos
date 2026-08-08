export interface CadastrarAtivoRequest {
  codigoIdentificacao: string;
  equipamento: string;
  categoria: string;
  usuarioCadastroId: string;
}

export interface EditarAtivoRequest {
  equipamento: string;
  categoria: string;
}

export interface EmprestarAtivoRequest {
  usuarioSolicitanteId: string;
  setorDestino: string;
  observacoes?: string;
}
