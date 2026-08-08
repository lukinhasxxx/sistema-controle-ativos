export type StatusAtivo = 'Disponível' | 'Em Uso' | 'Manutenção' | 'Estoque';

export interface AtivoResponse {
  id: string;
  codigoIdentificacao: string;
  equipamento: string;
  categoria: string;
  status: StatusAtivo;
  isExcluido: boolean;
  usuarioCadastroId: string;
  setor: string;
  responsavel: string | null;
}

export interface EmprestimoResponse {
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
