import React from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';

function DropdownMenu({ isOpen, options, reference }) {
  return isOpen ? (
    <div className={styles['menu-container']} ref={reference}>
      {options.map(({ label, onClick, pagePath }) => {
        const Component = pagePath ? Link : 'button';
        return (
          <Component
            type="button"
            className={styles['button-container']}
            key={label}
            onClick={onClick}
            href={pagePath}
          >
            {label}
          </Component>
        );
      })}
    </div>
  ) : null;
}

export default DropdownMenu;
