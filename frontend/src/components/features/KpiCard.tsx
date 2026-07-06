import React from 'react';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorType: 'total' | 'available' | 'inUse' | 'maintenance';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, colorType }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${styles[`icon-${colorType}`]}`}>
        {icon}
      </div>
      <div className={styles.info}>
        <span className={styles.label}>{title}</span>
        <span className={`${styles.value} ${styles[`text-${colorType}`]}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default KpiCard;
