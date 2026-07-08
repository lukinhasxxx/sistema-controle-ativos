'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Globe, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import styles from './login.module.css';
import logoCejam from '../../assets/logos/cejamLogon.png';

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
          <Image src={logoCejam} alt="CEJAM Logo" className={styles.logoImage} />
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
            <a href="https://www.facebook.com/cejamoficial/?locale=pt_BR" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook size={20} /></a>
            <a href="https://www.instagram.com/cejamoficial/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram size={20} /></a>
            <a href="https://br.linkedin.com/company/cejam" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin size={20} /></a>
            <a href="https://www.youtube.com/tvcejam" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube size={20} /></a>
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
