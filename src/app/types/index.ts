export type StatusAtivo = 'Disponível' | 'Em Uso' | 'Manutenção';

export interface IAtivo {
  id: string;
  codigo: string;
  equipamento: string;
  categoria: string;
  status: StatusAtivo;
  responsavel: string | null;
  ultimaMovimentacao: string | null;
}

export interface IUsuario {
  id: string;
  nome: string;
  avatar?: string;
  setor?: string;
}
