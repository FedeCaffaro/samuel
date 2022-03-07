import React from 'react';
import cn from 'classnames';

import { CLOSE_ICON } from '../Navbar/components/BurguerMenu/constants';

import styles from './styles.module.scss';

function BottomPopupWithButton({ text, onClick, href, buttonLabel, buttonClassname }) {
  const Component = href ? 'a' : 'button';
  const componentProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { onClick, type: 'button' };

  const handleClose = () => console.log('CLOSE');

  return (
    <div className={styles.fixed}>
      <div className={styles.container}>
        <span className={styles.message}>{text}</span>
        <Component className={cn(styles.button, buttonClassname)} {...componentProps}>
          {buttonLabel}
        </Component>
        <img src={CLOSE_ICON} className={styles.close} onClick={handleClose} />
      </div>
    </div>
  );
}

export default BottomPopupWithButton;
