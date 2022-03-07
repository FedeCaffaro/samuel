import React, { useState } from 'react';
import cn from 'classnames';

import { CLOSE_ICON } from '../Navbar/components/BurguerMenu/constants';

import styles from './styles.module.scss';

function BottomPopupWithButton({ text, onClick, href, buttonLabel, buttonClassname, show, notClose }) {
  const Component = href ? 'a' : 'button';
  const componentProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick, type: 'button' };

  const [isOpen, setIsOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600);
  };

  return show && isOpen ? (
    <div className={styles.fixed}>
      <div
        className={cn(styles.container, {
          [styles.closing]: isClosing
        })}
      >
        <span className={styles.message}>{text}</span>
        <Component className={cn(styles.button, buttonClassname)} {...componentProps}>
          {buttonLabel}
        </Component>
        {!notClose && <img src={CLOSE_ICON} className={styles.close} onClick={handleClose} />}
      </div>
    </div>
  ) : null;
}

export default BottomPopupWithButton;
