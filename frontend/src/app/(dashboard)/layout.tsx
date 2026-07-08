import React from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main style={{ padding: '0 2rem 2rem 2rem', flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
