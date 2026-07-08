'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { loginUsuario, cadastrarUsuario } from '../../services';
import styles from './login.module.css';
import logoCejam from '../../assets/logos/cejamLogon.png';

// Simple CPF Regex: 11 digits
const CPF_REGEX = /^\d{11}$/;

export default function Login() {
  const router = useRouter();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Register form
  const [regNome, setRegNome] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSetor, setRegSetor] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regSenha, setRegSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const usuario = await loginUsuario(loginEmail, loginSenha);
      localStorage.setItem(
        'usuarioLogado',
        JSON.stringify({
          id: usuario.id,
          nome: usuario.nomeCompleto,
          setor: usuario.setor,
        }),
      );
      document.cookie = 'isLoggedIn=true; path=/';
      toast.success(`Bem-vindo, ${usuario.nomeCompleto}!`);
      router.push('/');
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao fazer login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = regCpf.replace(/\D/g, '');
    if (!CPF_REGEX.test(cleanCpf)) {
      toast.error('CPF inválido. Informe 11 dígitos numéricos.');
      return;
    }
    setIsRegistering(true);
    try {
      await cadastrarUsuario({
        nomeCompleto: regNome,
        email: regEmail,
        cpf: cleanCpf,
        senha: regSenha,
        setor: regSetor,
      });
      toast.success('Cadastro realizado com sucesso!');
      setIsRegisterModalOpen(false);
      setRegNome('');
      setRegEmail('');
      setRegSetor('');
      setRegCpf('');
      setRegSenha('');
    } catch (err) {
      toast.error((err as Error).message || 'Erro ao cadastrar.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Image src={logoCejam} alt="CEJAM Logo" className={styles.logoImage} priority />
        </div>
        <h1 className={styles.mainTitle}>Gerenciamento de Ativos</h1>
        <h2 className={styles.title}>Acesse sua conta</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>E-mail</label>
            <input
              type="email"
              className={styles.input}
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Senha</label>
            <input
              type="password"
              className={styles.input}
              required
              value={loginSenha}
              onChange={(e) => setLoginSenha(e.target.value)}
            />
          </div>
          <div className={styles.actionGroup}>
            <Button type="submit" className={styles.submitBtn} disabled={isLoggingIn}>
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </Button>
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
          <div className={styles.modalFormGroup}>
            <label>Nome Completo</label>
            <input type="text" className={styles.input} required value={regNome} onChange={(e) => setRegNome(e.target.value)} />
          </div>
          <div className={styles.modalFormGroup}>
            <label>E-mail</label>
            <input type="email" className={styles.input} required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
          </div>
          <div className={styles.modalFormGroup}>
            <label>Setor</label>
            <select className={styles.input} required value={regSetor} onChange={(e) => setRegSetor(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="TI">TI</option>
              <option value="RH">RH</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>
          <div className={styles.modalFormGroup}>
            <label>CPF (apenas números)</label>
            <input
              type="text"
              className={styles.input}
              required
              maxLength={11}
              value={regCpf}
              onChange={(e) => setRegCpf(e.target.value)}
              placeholder="00000000000"
            />
          </div>
          <div className={styles.modalFormGroup}>
            <label>Senha</label>
            <input type="password" className={styles.input} required value={regSenha} onChange={(e) => setRegSenha(e.target.value)} />
          </div>
          <div className={styles.modalActions}>
            <Button type="button" variant="secondary" onClick={() => setIsRegisterModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isRegistering}>{isRegistering ? 'Cadastrando...' : 'Confirmar Cadastro'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
