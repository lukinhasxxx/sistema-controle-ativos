'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, AlertCircle, LayoutGrid, Package, Monitor, Loader2 } from 'lucide-react';
import {
  getAtivos,
  cadastrarAtivo,
  editarAtivo,
  emprestarAtivo,
  devolverAtivo,
  excluirAtivo,
  getUsuarios,
} from '../../services/api/clients';
import type { AtivoResponse, StatusAtivo } from '../../services/api/clients';
import KpiCard from '../../components/features/KpiCard';
import AtivosTable from '../../components/features/AtivosTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import styles from './page.module.css';

// ──────────────────────────────────────────────────────────────────────────────
// Tipos locais
// ──────────────────────────────────────────────────────────────────────────────
type ViewMode = 'inventario' | 'todos-ativos' | 'emprestimos';

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
function DashboardContent() {
  // Lista completa vinda da API
  const [todosAtivos, setTodosAtivos] = useState<AtivoResponse[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const view = (searchParams.get('view') as ViewMode) || 'inventario';

  const [filtroStatus, setFiltroStatus] = useState<StatusAtivo | null>(null);

  const [selectedAtivo, setSelectedAtivo] = useState<AtivoResponse | null>(null);

  // Form refs — evita criar state para cada campo do formulário
  const cadastrarFormRef = useRef<HTMLFormElement>(null);
  const emprestimoFormRef = useRef<HTMLFormElement>(null);
  const editarFormRef = useRef<HTMLFormElement>(null);

  // Modal States
  const [isCadastrarModalOpen, setIsCadastrarModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [isDevolucaoModalOpen, setIsDevolucaoModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);

  // ── Busca da API ────────────────────────────────────────────────────────────
  const fetchAtivosEUsuarios = useCallback(async () => {
    setIsLoading(true);
    try {
      // Sempre busca com excluídos, filtramos no frontend baseado na view
      const [ativosData, usuariosData] = await Promise.all([
        getAtivos(true),
        getUsuarios(),
      ]);
      setTodosAtivos(ativosData);
      setUsuarios(usuariosData);
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao buscar dados.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAtivosEUsuarios();
  }, [fetchAtivosEUsuarios]);

  // ── Filtro por View e Setor ─────────────────────────────────────────────────
  const ativosFiltradosPorView: AtivoResponse[] = (() => {
    const usuario = getUsuarioLogado();
    
    if (view === 'todos-ativos') {
      return todosAtivos;
    } 
    
    if (view === 'emprestimos') {
      return todosAtivos.filter(a => a.status === 'Em Uso' && !a.isExcluido);
    }
    
    // view === 'inventario' (default)
    if (!usuario) return todosAtivos.filter(a => !a.isExcluido);
    return todosAtivos.filter((a) => a.setor === usuario.setor && !a.isExcluido);
  })();

  // ── KPIs — calculados sobre a lista filtrada pela view (sem filtro de status aplicado)
  const total = ativosFiltradosPorView.length;
  const disponiveis = ativosFiltradosPorView.filter((a) => a.status === 'Disponível').length;
  const emUso = ativosFiltradosPorView.filter((a) => a.status === 'Em Uso').length;
  const manutencao = ativosFiltradosPorView.filter((a) => a.status === 'Manutenção').length;
  const estoque = ativosFiltradosPorView.filter((a) => a.status === 'Estoque').length;

  // ── Lista final exibida na tabela (com filtro de status, se houver)
  const ativos = filtroStatus 
    ? ativosFiltradosPorView.filter((a) => a.status === filtroStatus)
    : ativosFiltradosPorView;

  const handleKpiClick = (status: StatusAtivo | null) => {
    setFiltroStatus(prev => prev === status ? null : status);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = cadastrarFormRef.current;
    if (!form) return;

    const usuario = getUsuarioLogado();
    if (!usuario || !usuario.id) {
      toast.error('Sessão inválida. Faça login novamente.');
      return;
    }

    const payload = {
      codigoIdentificacao: (form.elements.namedItem('codigo') as HTMLInputElement)?.value,
      equipamento: (form.elements.namedItem('equipamento') as HTMLInputElement)?.value,
      categoria: (form.elements.namedItem('categoria') as HTMLSelectElement)?.value,
      usuarioCadastroId: usuario.id,
    };

    try {
      await cadastrarAtivo(payload);
      toast.success('Ativo cadastrado com sucesso!');
      setIsCadastrarModalOpen(false);
      form.reset();
      fetchAtivosEUsuarios();
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
      usuarioSolicitanteId: (form.elements.namedItem('responsavel') as HTMLSelectElement)?.value,
      setorDestino: (form.elements.namedItem('setorEmprestimo') as HTMLInputElement)?.value,
      observacoes: (form.elements.namedItem('observacoes') as HTMLTextAreaElement)?.value,
    };

    try {
      await emprestarAtivo(selectedAtivo.id, payload);
      toast.success('Empréstimo realizado com sucesso!');
      setIsEmprestimoModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivosEUsuarios();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao registrar empréstimo.');
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtivo) return;
    const form = editarFormRef.current;
    if (!form) return;

    const payload = {
      equipamento: (form.elements.namedItem('equipamento') as HTMLInputElement)?.value,
      categoria: (form.elements.namedItem('categoria') as HTMLSelectElement)?.value,
    };

    try {
      await editarAtivo(selectedAtivo.id, payload);
      toast.success('Ativo editado com sucesso!');
      setIsEditarModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivosEUsuarios();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao editar ativo.');
    }
  };

  const handleDevolucao = async () => {
    if (!selectedAtivo) return;
    try {
      await devolverAtivo(selectedAtivo.id);
      toast.success('Devolução registrada com sucesso!');
      setIsDevolucaoModalOpen(false);
      setSelectedAtivo(null);
      fetchAtivosEUsuarios();
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
      fetchAtivosEUsuarios();
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao excluir ativo.');
    }
  };

  const openEmprestimo = (ativo: AtivoResponse) => {
    setSelectedAtivo(ativo);
    setIsEmprestimoModalOpen(true);
  };

  const openDevolucao = (ativo: AtivoResponse) => {
    setSelectedAtivo(ativo);
    setIsDevolucaoModalOpen(true);
  };

  const openExcluir = (ativo: AtivoResponse) => {
    setSelectedAtivo(ativo);
    setIsExcluirModalOpen(true);
  };

  const openEditar = (ativo: AtivoResponse) => {
    setSelectedAtivo(ativo);
    setIsEditarModalOpen(true);
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>
          {view === 'inventario' && 'Inventário do Setor'}
          {view === 'todos-ativos' && 'Todos os Ativos (Geral)'}
          {view === 'emprestimos' && 'Ativos Emprestados'}
        </h2>
        <Button
          onClick={() => setIsCadastrarModalOpen(true)}
          icon={<Plus size={18} />}
        >
          Cadastrar Ativo
        </Button>
      </div>

      <div className={styles.kpiGrid}>
        <KpiCard 
          title="Total de Ativos:" 
          value={total} 
          icon={<LayoutGrid size={24} />} 
          colorType="total" 
          isActive={filtroStatus === null}
          onClick={() => handleKpiClick(null)}
        />
        <KpiCard 
          title="Disponíveis:" 
          value={disponiveis} 
          icon={<Package size={24} />} 
          colorType="available" 
          isActive={filtroStatus === 'Disponível'}
          onClick={() => handleKpiClick('Disponível')}
        />
        <KpiCard 
          title="Em Uso:" 
          value={emUso} 
          icon={<Monitor size={24} />} 
          colorType="inUse" 
          isActive={filtroStatus === 'Em Uso'}
          onClick={() => handleKpiClick('Em Uso')}
        />
        <KpiCard 
          title="Manutenção:" 
          value={manutencao} 
          icon={<AlertCircle size={24} />} 
          colorType="maintenance" 
          isActive={filtroStatus === 'Manutenção'}
          onClick={() => handleKpiClick('Manutenção')}
        />
        <KpiCard 
          title="Estoque:" 
          value={estoque} 
          icon={<Package size={24} />} 
          colorType="available" 
          isActive={filtroStatus === 'Estoque'}
          onClick={() => handleKpiClick('Estoque')}
        />
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
              <select 
                name="responsavel" 
                className={styles.input} 
                required
                onChange={(e) => {
                  const userId = e.target.value;
                  const user = usuarios.find(u => u.id === userId);
                  const form = emprestimoFormRef.current;
                  if (form && user) {
                    const setorInput = form.elements.namedItem('setorEmprestimo') as HTMLInputElement;
                    if (setorInput) setorInput.value = user.setor;
                  }
                }}
              >
                <option value="">Selecione...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nomeCompleto} - {u.setor}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Setor</label>
              <input 
                name="setorEmprestimo" 
                type="text" 
                className={styles.input} 
                readOnly 
                required 
                placeholder="Preenchido automaticamente"
              />
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

      {/* ── Modal Editar ──────────────────────────────────────────────────── */}
      <Modal
        isOpen={isEditarModalOpen}
        onClose={() => setIsEditarModalOpen(false)}
        title="Editar Ativo"
      >
        <form ref={editarFormRef} onSubmit={handleEditar} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome do equipamento</label>
            <input 
              name="equipamento" 
              type="text" 
              className={styles.input} 
              defaultValue={selectedAtivo?.equipamento}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Categoria</label>
            <select 
              name="categoria" 
              className={styles.input} 
              defaultValue={selectedAtivo?.categoria}
              required
            >
              <option value="">Selecione...</option>
              <option value="Monitor">Monitor</option>
              <option value="Notebook">Notebook</option>
              <option value="Periférico">Periférico</option>
              <option value="Mobília">Mobília</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsEditarModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={32} /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
