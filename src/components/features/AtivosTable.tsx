import React, { useState } from 'react';
import { Handshake, CornerUpLeft, Pencil, Trash, ArrowUpDown } from 'lucide-react';
import { IAtivo } from '../../types';
import styles from './AtivosTable.module.css';

interface AtivosTableProps {
  ativos: IAtivo[];
  onEmprestimo: (ativo: IAtivo) => void;
  onDevolucao: (ativo: IAtivo) => void;
  onEditar: (ativo: IAtivo) => void;
  onExcluir: (ativo: IAtivo) => void;
}

type SortField = 'categoria' | 'status' | null;
type SortOrder = 'asc' | 'desc';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Disponível': return styles.statusAvailable;
    case 'Em Uso': return styles.statusInUse;
    case 'Manutenção': return styles.statusMaintenance;
    default: return '';
  }
};

const AtivosTable: React.FC<AtivosTableProps> = ({ 
  ativos, 
  onEmprestimo, 
  onDevolucao, 
  onEditar, 
  onExcluir 
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedAtivos = [...ativos].sort((a, b) => {
    if (!sortField) return 0;
    
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Equipamento</th>

            <th 
              className={styles.sortableHeader} 
              onClick={() => handleSort('status')}>
              Categoria <ArrowUpDown size={14} className={styles.sortIcon} />
            </th>
            <th>Status</th>
            <th>Responsável</th>
            <th 
              className={styles.sortableHeader} 
              onClick={() => handleSort('categoria')}>
              Última Movimentação <ArrowUpDown size={14} className={styles.sortIcon} />
            </th>
            <th className={styles.actionsHeader}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedAtivos.map((ativo) => (
            <tr key={ativo.id}>
              <td>{ativo.codigo}</td>
              <td className={styles.equipamento}>{ativo.equipamento}</td>
              <td>{ativo.categoria}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(ativo.status)}`}>
                  {ativo.status}
                </span>
              </td>
              <td>{ativo.responsavel || '—'}</td>
              <td>{ativo.ultimaMovimentacao || '—'}</td>
              <td>
                <div className={styles.actions}>
                  <button onClick={() => onEmprestimo(ativo)} title="Empréstimo" className={styles.actionBtn}>
                    <Handshake size={18} />
                  </button>
                  <button onClick={() => onDevolucao(ativo)} title="Devolução" className={styles.actionBtn}>
                    <CornerUpLeft size={18} />
                  </button>
                  <button onClick={() => onEditar(ativo)} title="Editar" className={styles.actionBtn}>
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => onExcluir(ativo)} title="Excluir" className={`${styles.actionBtn} ${styles.dangerBtn}`}>
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile view - Cards */}
      <div className={styles.mobileList}>
        <div className={styles.mobileSortControls}>
          <button onClick={() => handleSort('categoria')} className={styles.sortBtn}>
            Ordenar por Categoria <ArrowUpDown size={14} />
          </button>
          <button onClick={() => handleSort('status')} className={styles.sortBtn}>
            Ordenar por Status <ArrowUpDown size={14} />
          </button>
        </div>
        {sortedAtivos.map((ativo) => (
          <div key={ativo.id} className={styles.mobileCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardCode}>{ativo.codigo}</span>
              <span className={`${styles.statusBadge} ${getStatusClass(ativo.status)}`}>
                {ativo.status}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{ativo.equipamento}</h3>
            <div className={styles.cardDetails}>
              <p><strong>Categoria:</strong> {ativo.categoria}</p>
              <p><strong>Responsável:</strong> {ativo.responsavel || '—'}</p>
              <p><strong>Movimentação:</strong> {ativo.ultimaMovimentacao || '—'}</p>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => onEmprestimo(ativo)} className={styles.actionBtn}><Handshake size={18} /></button>
              <button onClick={() => onDevolucao(ativo)} className={styles.actionBtn}><CornerUpLeft size={18} /></button>
              <button onClick={() => onEditar(ativo)} className={styles.actionBtn}><Pencil size={18} /></button>
              <button onClick={() => onExcluir(ativo)} className={`${styles.actionBtn} ${styles.dangerBtn}`}><Trash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtivosTable;
