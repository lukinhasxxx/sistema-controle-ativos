'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AtSign, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import styles from './login.module.css';

// Simple CPF Regex: 11 digits
const CPF_REGEX = /^\d{11}$/;

export default function Login() {
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [cpf, setCpf] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('usuarioLogado', JSON.stringify({ id: '11111111-1111-1111-1111-111111111111', setor: 'TI' }));
    router.push('/');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, ''); // Remove non-digits
    if (!CPF_REGEX.test(cleanCpf)) {
      toast.error('CPF inválido ou não pertence a um funcionário');
      return;
    }
    toast.success('Cadastrado com sucesso');
    setIsRegisterModalOpen(false);
    setCpf('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>CEJAM</span>
        </div>
        <h2 className={styles.title}>Acesse sua conta</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input type="email" className={styles.input} required defaultValue="admin@cejam.org.br" />
          </div>
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input type="password" className={styles.input} required defaultValue="123456" />
          </div>
          <div className={styles.actionGroup}>
            <Button type="submit" className={styles.submitBtn}>Entrar</Button>
            <Button type="button" variant="secondary" className={styles.registerBtn} onClick={() => setIsRegisterModalOpen(true)}>Cadastrar</Button>
          </div>
        </form>
        
        <footer className={styles.footer}>
          <p>Siga-nos nas redes sociais:</p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><Globe size={20} /></a>
            <a href="#" aria-label="Instagram"><MessageCircle size={20} /></a>
            <a href="#" aria-label="LinkedIn"><LinkIcon size={20} /></a>
            <a href="#" aria-label="YouTube"><AtSign size={20} /></a>
          </div>
        </footer>
      </div>

      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        title="Cadastrar Funcionário"
      >
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome Completo</label>
            <input type="text" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input type="email" className={styles.input} required />
          </div>
          <div className={styles.formGroup}>
            <label>Setor</label>
            <select className={styles.input} required>
              <option value="">Selecione...</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>CPF (apenas números)</label>
            <input 
              type="text" 
              className={styles.input} 
              required 
              maxLength={11}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="00000000000"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input type="password" className={styles.input} required />
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsRegisterModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Confirmar Cadastro</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
