'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuarioLogado');
      if (raw) setUsuario(JSON.parse(raw) as UsuarioLogado);
    } catch {
      // sem usuário no storage
    }
  }, []);

  const handleLogout = () => {
    if (showLogoutConfirm) return;
    setShowLogoutConfirm(true);

    toast(
      (t) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontWeight: 500 }}>Deseja encerrar a sessão?</span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                setShowLogoutConfirm(false);
              }}
              style={{
                padding: '4px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                localStorage.removeItem('usuarioLogado');
                document.cookie = 'isLoggedIn=; path=/; max-age=0';
                toast.success('Sessão encerrada com sucesso.');
                router.push('/login');
              }}
              style={{
                padding: '4px 12px',
                border: 'none',
                borderRadius: '6px',
                background: '#e53e3e',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Sair
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
        style: {
          minWidth: '260px',
        },
      },
    );
  };

  const displayName = usuario?.nome ?? `Usuário — ${usuario?.setor ?? ''}`;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Ativos</h1>
      <div className={styles.headerActions}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>{initial}</div>
          <span className={styles.userName}>{displayName}</span>
        </div>
        <button
          onClick={handleLogout}
          className={styles.logoutBtn}
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
