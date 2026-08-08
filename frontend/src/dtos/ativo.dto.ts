export type StatusAtivoDTO = 'Disponível' | 'Em Uso' | 'Manutenção' | 'Estoque';

export interface AtivoResponseDTO {
  id: string;
  codigoIdentificacao: string;
  equipamento: string;
  categoria: string;
  status: StatusAtivoDTO;
  isExcluido: boolean;
  usuarioCadastroId: string;
  setor: string;
  responsavel: string | null;
}

export interface EmprestimoResponseDTO {
  id: string;
  ativoId: string;
  equipamento: string;
  usuarioSolicitanteId: string;
  nomeUsuario: string;
  setorDestino: string;
  dataEmprestimo: string;
  dataDevolucao: string | null;
  observacoes: string | null;
}
