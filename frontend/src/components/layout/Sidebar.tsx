'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Folder, Handshake, ChevronLeft } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
    >
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
      <button
        className={styles.collapseBtn}
        onClick={() => setIsExpanded(false)}
        title="Recolher menu"
      >
        <ChevronLeft size={20} />
      </button>
    </aside>
  );
};

export default Sidebar;
