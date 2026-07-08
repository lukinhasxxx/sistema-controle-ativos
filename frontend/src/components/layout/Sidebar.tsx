'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Folder, Handshake, ChevronLeft } from 'lucide-react';
import styles from './Sidebar.module.css';
import logoCejam from '../../assets/logos/cejamLogon.png';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.logoContainer}>
        <Image src={logoCejam} alt="CEJAM Logo" className={styles.logoImage} priority />
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
