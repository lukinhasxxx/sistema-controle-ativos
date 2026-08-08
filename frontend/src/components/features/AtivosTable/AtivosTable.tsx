import React, { useState } from 'react';
import { Handshake, CornerUpLeft, Pencil, Trash, ArrowUpDown, CheckCircle, MonitorPlay, AlertTriangle, Box } from 'lucide-react';
import type { AtivoResponseDTO } from '../../../dtos';
import styles from './AtivosTable.module.css';

interface AtivosTableProps {
  ativos: AtivoResponseDTO[];
  onEmprestimo: (ativo: AtivoResponseDTO) => void;
  onDevolucao: (ativo: AtivoResponseDTO) => void;
  onEditar: (ativo: AtivoResponseDTO) => void;
  onExcluir: (ativo: AtivoResponseDTO) => void;
}

// Colunas que suportam ordenação
type SortField = 'categoria' | 'status' | 'setor' | null;
type SortOrder = 'asc' | 'desc';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Disponível':  return styles.statusAvailable;
    case 'Em Uso':      return styles.statusInUse;
    case 'Manutenção':  return styles.statusMaintenance;
    case 'Estoque':     return styles.statusStock;
    default:            return '';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Disponível':  return <CheckCircle size={14} style={{ marginRight: 4 }} />;
    case 'Em Uso':      return <MonitorPlay size={14} style={{ marginRight: 4 }} />;
    case 'Manutenção':  return <AlertTriangle size={14} style={{ marginRight: 4 }} />;
    case 'Estoque':     return <Box size={14} style={{ marginRight: 4 }} />;
    default:            return null;
  }
};

const AtivosTable: React.FC<AtivosTableProps> = ({
  ativos,
  onEmprestimo,
  onDevolucao,
  onEditar,
  onExcluir,
}) => {
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // ── Lógica de ordenação ────────────────────────────────────────────────────
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

    const valueA = (a[sortField] ?? '') as string;
    const valueB = (b[sortField] ?? '') as string;

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // ── Helper: ícone de seta com indicação visual do campo ativo ──────────────
  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      size={14}
      className={`${styles.sortIcon} ${sortField === field ? styles.sortIconActive : ''}`}
    />
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      {/* ── Tabela — desktop ───────────────────────────────────────────────── */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Equipamento</th>

            {/* Categoria — sortável */}
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('categoria')}
            >
              Categoria <SortIcon field="categoria" />
            </th>

            {/* Status — sortável */}
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('status')}
            >
              Status <SortIcon field="status" />
            </th>

            <th>Responsável</th>

            {/* Setor — sortável */}
            <th
              className={styles.sortableHeader}
              onClick={() => handleSort('setor')}
            >
              Setor <SortIcon field="setor" />
            </th>

            <th className={styles.actionsHeader}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedAtivos.map((ativo) => (
            <tr key={ativo.id} style={{ opacity: ativo.isExcluido ? 0.6 : 1, backgroundColor: ativo.isExcluido ? '#fef2f2' : 'transparent' }}>
              <td>
                {ativo.codigoIdentificacao}
                {ativo.isExcluido && (
                  <span style={{ marginLeft: 8, fontSize: '0.7rem', background: '#e53e3e', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                    Excluído
                  </span>
                )}
              </td>
              <td className={styles.equipamento} style={{ textDecoration: ativo.isExcluido ? 'line-through' : 'none' }}>{ativo.equipamento}</td>
              <td>{ativo.categoria}</td>
              <td>
                <span className={`${styles.statusBadge} ${getStatusClass(ativo.status)}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {getStatusIcon(ativo.status)}
                  {ativo.status}
                </span>
              </td>
              <td>{ativo.responsavel || '—'}</td>
              <td>{ativo.setor || '—'}</td>
              <td>
                <div className={styles.actions}>
                  <button
                    onClick={() => onEmprestimo(ativo)}
                    title="Empréstimo"
                    className={styles.actionBtn}
                    disabled={ativo.isExcluido}
                    style={ativo.isExcluido ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    <Handshake size={18} />
                  </button>
                  <button
                    onClick={() => onDevolucao(ativo)}
                    title="Devolução"
                    className={styles.actionBtn}
                    disabled={ativo.status !== 'Em Uso' || ativo.isExcluido}
                    style={(ativo.status !== 'Em Uso' || ativo.isExcluido) ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    <CornerUpLeft size={18} />
                  </button>
                  <button
                    onClick={() => onEditar(ativo)}
                    title="Editar"
                    className={styles.actionBtn}
                    disabled={ativo.isExcluido}
                    style={ativo.isExcluido ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onExcluir(ativo)}
                    title="Excluir"
                    className={`${styles.actionBtn} ${styles.dangerBtn}`}
                    disabled={ativo.isExcluido}
                    style={ativo.isExcluido ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Cards — mobile ─────────────────────────────────────────────────── */}
      <div className={styles.mobileList}>
        <div className={styles.mobileSortControls}>
          <button onClick={() => handleSort('categoria')} className={styles.sortBtn}>
            Categoria <ArrowUpDown size={14} />
          </button>
          <button onClick={() => handleSort('status')} className={styles.sortBtn}>
            Status <ArrowUpDown size={14} />
          </button>
          <button onClick={() => handleSort('setor')} className={styles.sortBtn}>
            Setor <ArrowUpDown size={14} />
          </button>
        </div>

        {sortedAtivos.map((ativo) => (
          <div key={ativo.id} className={styles.mobileCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cardCode}>{ativo.codigoIdentificacao}</span>
              <span className={`${styles.statusBadge} ${getStatusClass(ativo.status)}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {getStatusIcon(ativo.status)}
                {ativo.status}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{ativo.equipamento}</h3>
            <div className={styles.cardDetails}>
              <p><strong>Categoria:</strong> {ativo.categoria}</p>
              <p><strong>Responsável:</strong> {ativo.responsavel || '—'}</p>
              <p><strong>Setor:</strong> {ativo.setor || '—'}</p>
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => onEmprestimo(ativo)} className={styles.actionBtn}>
                <Handshake size={18} />
              </button>
              <button 
                onClick={() => onDevolucao(ativo)} 
                className={styles.actionBtn}
                disabled={ativo.status !== 'Em Uso'}
                style={ativo.status !== 'Em Uso' ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
              >
                <CornerUpLeft size={18} />
              </button>
              <button onClick={() => onEditar(ativo)} className={styles.actionBtn}>
                <Pencil size={18} />
              </button>
              <button onClick={() => onExcluir(ativo)} className={`${styles.actionBtn} ${styles.dangerBtn}`}>
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtivosTable;
