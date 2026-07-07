import { IAtivo, IUsuario } from '../types';

export const mockAtivos: IAtivo[] = [
  {
    id: '1',
    codigo: 'AT001',
    equipamento: 'Monitor Dell 24"',
    categoria: 'Monitor',
    status: 'Disponível',
    responsavel: null,
    setor: 'TI',
  },
  {
    id: '2',
    codigo: 'AT002',
    equipamento: 'Projetor Epson',
    categoria: 'Projetor',
    status: 'Em Uso',
    responsavel: 'João Silva',
    setor: 'Administrativo',
  },
  {
    id: '3',
    codigo: 'AT003',
    equipamento: 'Notebook Lenovo',
    categoria: 'Notebook',
    status: 'Disponível',
    responsavel: null,
    setor: 'TI',
  },
  {
    id: '4',
    codigo: 'AT004',
    equipamento: 'Mouse Logitech',
    categoria: 'Periférico',
    status: 'Em Uso',
    responsavel: 'Maria Santos',
    setor: 'RH',
  },
  {
    id: '5',
    codigo: 'AT005',
    equipamento: 'Teclado Mecânico',
    categoria: 'Periférico',
    status: 'Manutenção',
    responsavel: null,
    setor: 'Financeiro',
  },
];

export const mockUsuario: IUsuario = {
  id: 'u1',
  nome: 'Lucas Silva Testes',
};
