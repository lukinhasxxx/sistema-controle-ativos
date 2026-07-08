'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, AlertCircle, LayoutGrid, Package, Monitor } from 'lucide-react';
import { mockAtivos } from '../../utils/mocks';
import { IAtivo } from '../../types';
import KpiCard from '../../components/features/KpiCard';
import AtivosTable from '../../components/features/AtivosTable';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import styles from './page.module.css';

export default function Dashboard() {
  const [ativos, setAtivos] = useState<IAtivo[]>(mockAtivos);
  const [selectedAtivo, setSelectedAtivo] = useState<IAtivo | null>(null);

  // Modal States
  const [isCadastrarModalOpen, setIsCadastrarModalOpen] = useState(false);
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false);
  const [isDevolucaoModalOpen, setIsDevolucaoModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);

  // KPIs calculation
  const total = ativos.length;
  const disponiveis = ativos.filter(a => a.status === 'Disponível').length;
  const emUso = ativos.filter(a => a.status === 'Em Uso').length;
  const manutencao = ativos.filter(a => a.status === 'Manutenção').length;

  // Handlers
  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Ativo cadastrado com sucesso!');
    setIsCadastrarModalOpen(false);
  };

  const handleEmprestimo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Empréstimo realizado com sucesso!');
    setIsEmprestimoModalOpen(false);
    setSelectedAtivo(null);
  };

  const handleDevolucao = () => {
    toast.success('Devolução registrada com sucesso!');
    setIsDevolucaoModalOpen(false);
    setSelectedAtivo(null);
  };

  const handleExcluir = () => {
    if (selectedAtivo) {
      setAtivos(ativos.filter(a => a.id !== selectedAtivo.id));
      toast.success('Ativo excluído com sucesso!');
      setIsExcluirModalOpen(false);
      setSelectedAtivo(null);
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

  const openEditar = (ativo: IAtivo) => {
    toast('Função de editar em desenvolvimento', { icon: '🚧' });
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div /> {/* Placeholder for layout balancing if needed */}
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
      </div>
      

      <AtivosTable 
        ativos={ativos}
        onEmprestimo={openEmprestimo}
        onDevolucao={openDevolucao}
        onEditar={openEditar}
        onExcluir={openExcluir}
      />

      {/* Modal Cadastrar Ativo */}
      <Modal 
        isOpen={isCadastrarModalOpen} 
        onClose={() => setIsCadastrarModalOpen(false)}
        title="Cadastrar Ativo"
      >
        <form onSubmit={handleCadastrar} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome do equipamento</label>
            <input type="text" className={styles.input} required />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Código de identificação</label>
              <input type="text" className={styles.input} required />
            </div>
            <div className={styles.formGroup}>
              <label>Categoria</label>
              <select className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="Monitor">Monitor</option>
                <option value="Notebook">Notebook</option>
                <option value="Periférico">Periférico</option>
                <option value="Mobília">Mobília</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsCadastrarModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Realizar Empréstimo */}
      <Modal 
        isOpen={isEmprestimoModalOpen} 
        onClose={() => setIsEmprestimoModalOpen(false)}
        title="Realizar Empréstimo"
      >
        <form onSubmit={handleEmprestimo} className={styles.form}>
          <p className={styles.modalSubtitle}>{selectedAtivo?.equipamento}</p>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Responsável</label>
              <select className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Santos">Maria Santos</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Setor</label>
              <select className={styles.input} required>
                <option value="">Selecione...</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Observações</label>
            <textarea className={styles.input} rows={3}></textarea>
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsEmprestimoModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Confirmar Empréstimo</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Registrar Devolução */}
      <Modal 
        isOpen={isDevolucaoModalOpen} 
        onClose={() => setIsDevolucaoModalOpen(false)}
        title="Registrar Devolução"
      >
        <div className={styles.form}>
          <p>Deseja registrar a devolução deste equipamento?</p>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsDevolucaoModalOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={handleDevolucao}>Confirmar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Excluir */}
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
            <Button type="button" variant="danger" onClick={handleExcluir}>Excluir</Button>
            <Button type="button" variant="secondary" onClick={() => setIsExcluirModalOpen(false)}>Cancelar</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
