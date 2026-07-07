import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Folder, Handshake } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}></div>
        <span className={styles.logoText}>CEJAM</span>
      </div>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${styles.active}`}>
          <LayoutDashboard size={20} />
          <span>Inventário</span>
        </Link>
        <Link href="/" className={styles.navItem}>
          <Folder size={20} />
          <span>Todos os ativos</span>
        </Link>
        <Link href="/" className={styles.navItem}>
          <Handshake size={20} />
          <span>Empréstimos</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
