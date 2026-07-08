export type StatusAtivo = 'Disponível' | 'Em Uso' | 'Manutenção' | 'Estoque';

export interface IAtivo {
  id: string;
  codigo: string;
  equipamento: string;
  categoria: string;
  status: StatusAtivo;
  responsavel: string | null;
  setor: string;
  codigoIdentificacao: string;
}

export interface IUsuario {
  id: string;
  nome: string;
  avatar?: string;
  setor?: string;
}
