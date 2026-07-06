import React from 'react';
import { mockUsuario } from '../../utils/mocks';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Controle de Ativos</h1>
      <div className={styles.userProfile}>
        <div className={styles.avatar}>
          {mockUsuario.nome.charAt(0)}
        </div>
        <span className={styles.userName}>{mockUsuario.nome}</span>
      </div>
    </header>
  );
};

export default Header;
