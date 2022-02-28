/* eslint-disable no-empty-function */
import React from 'react';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

function NavbarButton({ text, icon, link, onClick = () => {} }) {
  const router = useRouter();
  const handleClick = link ? () => router.push(link) : onClick;

  return (
    <div className={styles['menu-container']} onClick={handleClick}>
      <span className={styles['menu-text']}>{text}</span>
      {icon && <img src={icon} className={styles['menu-icon']} />}
    </div>
  );
}

export default NavbarButton;
