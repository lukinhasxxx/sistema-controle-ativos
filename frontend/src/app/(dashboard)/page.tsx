'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Plus, AlertCircle, LayoutGrid, Package, Monitor, Loader2 } from 'lucide-react';
import { IAtivo } from '../../types';
import {
  getAtivos,
  cadastrarAtivo,
  emprestarAtivo,
  devolverAtivo,
  excluirAtivo,
} from '../../services/api';
import KpiCard from '../../components/features/KpiCard';
import AtivosTable from '../../components/features/AtivosTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import styles from './page.module.css';

// ──────────────────────────────────────────────────────────────────────────────
// Tipos locais
// ──────────────────────────────────────────────────────────────────────────────
type AbaAtiva = 'inventario' | 'todos';

interface UsuarioLogado {
  id: string;
  setor: string;
}

function getUsuarioLogado(): UsuarioLogado | null {
  try {
    const raw = localStorage.getItem('usuarioLogado');
    return raw ? (JSON.parse(raw) as UsuarioLogado) : null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Componente
// ──────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // Lista completa vinda da API
  const [todosAtivos, setTodosAtivos] = useState<IAtivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Aba ativa — controlada pela Sidebar via prop ou (futuramente) context
  // Por ora lemos de um estado interno; a Sidebar passará o valor via URL ou prop
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('inventario');

  const [selectedAtivo, setSelectedAtivo] = useState<IAtivo | null>(null);

  // Form refs — evita criar state para cada campo do formulário
  const cadastrarFormRef = useRef<HTMLFormElement>(null);
  const emprestimoFormRef = useRef<HTMLFormElement>(null);

  // Modal States
  const [isCadastrarModalOpen, setIsCadastrarModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [isDevolucaoModalOpen, setIsDevolucaoModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);

  // ── Busca da API ────────────────────────────────────────────────────────────
  const fetchAtivos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAtivos();
      setTodosAtivos(data);
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao buscar ativos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAtivos();
  }, [fetchAtivos]);

  // ── Filtro por setor (Regra de Negócio Crítica) ─────────────────────────────
  const ativos: IAtivo[] = (() => {
    if (abaAtiva === 'todos') return todosAtivos;
    const usuario = getUsuarioLogado();
    if (!usuario) return todosAtivos;
    return todosAtivos.filter((a) => a.setor === usuario.setor);
  })();

  // ── KPIs — calculados sobre a lista exibida ─────────────────────────────────
  const total = ativos.length;
  const disponiveis = ativos.filter((a) => a.status === 'Disponível').length;
  const emUso = ativos.filter((a) => a.status === 'Em Uso').length;
  const manutencao = ativos.filter((a) => a.status === 'Manutenção').length;
  const estoque = ativos.filter((a) => a.status === 'Estoque').length;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = cadastrarFormRef.current;
    if (!form) return;

    const usuario = getUsuarioLogado();
    const payload = {
      equipamento: (form.elements.namedItem('equipamento') as HTMLInputElement)?.value,
      codigo: (form.elements.namedItem('codigo') as HTMLInputElement)?.value,
      categoria: (form.elements.namedItem('categoria') as HTMLSelectElement)?.value,
      status: (form.elements.namedItem('status') as HTMLSelectElement)?.value,
      usuarioCadastroId: usuario?.id ?? null,
      setor: usuario?.setor ?? null,
    };

    try {
      await cadastrarAtivo(payload);
      toast.success('Ativo cadastrado com sucesso!');
      setIsCadastrarModalOpen(false);
      form.reset();
      fetchAtivos();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao cadastrar ativo.');
    }
  };

  const handleEmprestimo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtivo) return;
    const form = emprestimoFormRef.current;
    if (!form) return;

    const payload = {
      responsavel: (form.elements.namedItem('responsavel') as HTMLSelectElement)?.value,
      setor: (form.elements.namedItem('setorEmprestimo') as HTMLSelectElement)?.value,
      observacoes: (form.elements.namedItem('observacoes') as HTMLTextAreaElement)?.value,
    };

    try {
      await emprestarAtivo(selectedAtivo.id, payload);
      toast.success('Empréstimo realizado com sucesso!');
      setIsEmprestimoModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivos();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao registrar empréstimo.');
    }
  };

  const handleDevolucao = async () => {
    if (!selectedAtivo) return;
    try {
      await devolverAtivo(selectedAtivo.id);
      toast.success('Devolução registrada com sucesso!');
      setIsDevolucaoModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivos();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao registrar devolução.');
    }
  };

  const handleExcluir = async () => {
    if (!selectedAtivo) return;
    try {
      await excluirAtivo(selectedAtivo.id);
      toast.success('Ativo excluído com sucesso!');
      setIsExcluirModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivos();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao excluir ativo.');
    }
  };

  const openEmprestimo = (ativo: IAtivo) => {
    setSelectedAtivo(ativo);
    setIsEmprestimoModalOpen(true);
  };

  const openDevolucao = (ativo: IAtivo) => {
    setSelectedAtivo(ativo);
    setIsDevolucaoModalOpen(true);
  };

  const openExcluir = (ativo: IAtivo) => {
    setSelectedAtivo(ativo);
    setIsExcluirModalOpen(true);
  };

  const openEditar = (_ativo: IAtivo) => {
    toast('Função de editar em desenvolvimento', { icon: '🚧' });
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Seletor de aba (substituirá link da Sidebar quando houver contexto) */}
      <div className={styles.pageHeader}>
        <div className={styles.abas}>
          <div className={`${styles.abaBg} ${abaAtiva === 'todos' ? styles.slideRight : ''}`} />
          <button
            className={`${styles.abaBtn} ${abaAtiva === 'inventario' ? styles.abaAtiva : ''}`}
            onClick={() => setAbaAtiva('inventario')}
          >
            Inventário
          </button>
          <button
            className={`${styles.abaBtn} ${abaAtiva === 'todos' ? styles.abaAtiva : ''}`}
            onClick={() => setAbaAtiva('todos')}
          >
            Todos os ativos
          </button>
        </div>
        <Button
          onClick={() => setIsCadastrarModalOpen(true)}
          icon={<Plus size={18} />}
        >
          Cadastrar Ativo
        </Button>
      </div>

      <div className={styles.kpiGrid}>
        <KpiCard title="Total de Ativos:" value={total} icon={<LayoutGrid size={24} />} colorType="total" />
        <KpiCard title="Disponíveis:" value={disponiveis} icon={<Package size={24} />} colorType="available" />
        <KpiCard title="Em Uso:" value={emUso} icon={<Monitor size={24} />} colorType="inUse" />
        <KpiCard title="Manutenção:" value={manutencao} icon={<AlertCircle size={24} />} colorType="maintenance" />
        <KpiCard title="Estoque:" value={estoque} icon={<Package size={24} />} colorType="available" />
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Loader2 size={32} className={styles.spinner} />
        </div>
      ) : ativos.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>
            Seu setor não possui ativos no inventário. Gostaria de cadastrar?
          </h3>
          <Button 
            className={styles.emptyStateBtn} 
            onClick={() => setIsCadastrarModalOpen(true)} 
            icon={<Plus size={18} />}
          >
            Cadastrar Ativo
          </Button>
        </div>
      ) : (
        <AtivosTable
          ativos={ativos}
          onEmprestimo={openEmprestimo}
          onDevolucao={openDevolucao}
          onEditar={openEditar}
          onExcluir={openExcluir}
        />
      )}

      {/* ── Modal Cadastrar Ativo ─────────────────────────────────────────── */}
      <Modal
        isOpen={isCadastrarModalOpen}
        onClose={() => setIsCadastrarModalOpen(false)}
        title="Cadastrar Ativo"
      >
        <form ref={cadastrarFormRef} onSubmit={handleCadastrar} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome do equipamento</label>
            <input name="equipamento" type="text" className={styles.input} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Código de identificação</label>
              <input name="codigo" type="text" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <select name="categoria" className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="Monitor">Monitor</option>
                <option value="Notebook">Notebook</option>
                <option value="Periférico">Periférico</option>
                <option value="Mobília">Mobília</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select name="status" className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="Disponível">Disponível</option>
                <option value="Em Uso">Em Uso</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Estoque">Estoque</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsCadastrarModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Realizar Empréstimo ─────────────────────────────────────── */}
      <Modal
        isOpen={isEmprestimoModalOpen}
        onClose={() => setIsEmprestimoModalOpen(false)}
        title="Realizar Empréstimo"
      >
        <form ref={emprestimoFormRef} onSubmit={handleEmprestimo} className={styles.form}>
          <p className={styles.modalSubtitle}>{selectedAtivo?.equipamento}</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Responsável</label>
              <select name="responsavel" className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Setor</label>
              <select name="setorEmprestimo" className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Observações</label>
            <textarea name="observacoes" className={styles.input} rows={3}></textarea>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsEmprestimoModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Empréstimo</Button>
          </div>
        </form>
      </Modal>

      {/* ── Modal Registrar Devolução ─────────────────────────────────────── */}
      <Modal
        isOpen={isDevolucaoModalOpen}
        onClose={() => setIsDevolucaoModalOpen(false)}
        title="Registrar Devolução"
      >
        <div className={styles.form}>
          <p>Deseja registrar a devolução deste equipamento?</p>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsDevolucaoModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleDevolucao}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Excluir ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isExcluirModalOpen}
        onClose={() => setIsExcluirModalOpen(false)}
        title="Excluir"
      >
        <div className={styles.form}>
          <div className={styles.alertBox}>
            <AlertCircle size={20} />
            <p>Tem certeza que deseja remover este ativo? Esta ação não poderá ser desfeita.</p>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="danger" onClick={handleExcluir}>
              Excluir
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsExcluirModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
