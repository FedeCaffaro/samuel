/* eslint-disable no-empty-function */
import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import styles from './styles.module.scss';

function NavbarButton({ text, icon, link, onClick = () => {}, iconClassName, isOwner }) {
  const router = useRouter();
  const handleClick = link ? () => router.push(link) : onClick;

  return (
    <div
      className={cn(styles['menu-container'], {
        [styles.owner]: isOwner || true
      })}
      onClick={handleClick}
    >
      <span className={styles['menu-text']}>{text}</span>
      {icon && <img src={icon} className={cn(styles['menu-icon'], iconClassName)} />}
    </div>
  );
}

export default NavbarButton;
