'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Folder, Handshake, ChevronLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import styles from './Sidebar.module.css';
import logo from '../../../assets/logos/logo.png';

const SidebarContent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'inventario';

  return (
    <aside
      className={`${styles.sidebar} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Logo" className={styles.logoImage} priority />
      </div>
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${view === 'inventario' ? styles.active : ''}`}>
          <LayoutDashboard size={20} />
          <span>Inventário</span>
        </Link>
        <Link href="/?view=todos-ativos" className={`${styles.navItem} ${view === 'todos-ativos' ? styles.active : ''}`}>
          <Folder size={20} />
          <span>Todos os ativos</span>
        </Link>
        <Link href="/?view=emprestimos" className={`${styles.navItem} ${view === 'emprestimos' ? styles.active : ''}`}>
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

const Sidebar = () => {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <SidebarContent />
    </Suspense>
  );
};

export default Sidebar;
