import React from 'react';
import cn from 'classnames';

import styles from './styles.module.scss';
import LinkButton from './components/LinkButton';

function DropdownMenu({ isOpen, options, reference, className, isOwner }) {
  return isOpen ? (
    <div className={cn(styles['menu-container'], className)} ref={reference}>
      {options.map(({ label, onClick, pagePath }) => {
        const Component = pagePath ? LinkButton : 'button';
        return (
          <Component
            type="button"
            className={cn(styles['button-container'], {
              [styles.owner]: isOwner
            })}
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
