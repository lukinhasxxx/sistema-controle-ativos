'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import styles from './Header.module.css';

interface UsuarioLogado {
  id: string;
  setor: string;
  nome?: string;
}

const Header = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuarioLogado');
      if (raw) setUsuario(JSON.parse(raw) as UsuarioLogado);
    } catch {
      // sem usuário no storage
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Deseja mesmo encerrar a sessão?')) {
      localStorage.removeItem('usuarioLogado');
      router.push('/login');
    }
  };

  const displayName = usuario?.nome ?? `Usuário — ${usuario?.setor ?? ''}`;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Ativos</h1>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>{initial}</div>
        <span className={styles.userName}>{displayName}</span>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            marginLeft: '8px',
            color: 'var(--text-muted)',
          }}
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
