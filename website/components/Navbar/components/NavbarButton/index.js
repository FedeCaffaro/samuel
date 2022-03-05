/* eslint-disable no-empty-function */
import React from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import styles from './styles.module.scss';

function NavbarButton({ text, icon, link, onClick = () => {}, iconClassName, isOwner, big, newTab = false }) {
  const router = useRouter();
  const handleClick = link ? () => router.push(link) : onClick;
  const Component = newTab ? 'a' : 'div';

  return (
    <Component
      className={cn(styles['menu-container'], {
        [styles.owner]: isOwner
      })}
      {...(newTab ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : { onClick: handleClick })}
    >
      {text && (
        <span
          className={cn(styles['menu-text'], {
            [styles.big]: big
          })}
        >
          {text}
        </span>
      )}
      {icon && (
        <img
          src={icon}
          className={cn(styles['menu-icon'], iconClassName, {
            [styles.big]: big
          })}
        />
      )}
    </Component>
  );
}

export default NavbarButton;
