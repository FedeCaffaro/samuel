import i18next from 'i18next';
import React from 'react';

import styles from './styles.module.scss';

function Collections() {
  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('Collections:title')}</span>
    </div>
  );
}

export default Collections;
