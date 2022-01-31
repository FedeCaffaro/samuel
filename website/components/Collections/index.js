import i18next from 'i18next';
import React from 'react';
import Link from 'next/link';

import { DROPS } from '../../constants/drops';

import styles from './styles.module.scss';

function Collections() {
  const COLLECTIONS = DROPS.filter(({ type }) => type === 'active');

  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('Collections:title')}</span>
      {COLLECTIONS.map(({ name, href = '/' }) => (
        <Link href={href} key={name}>
          <span className={styles.collection}>{name}</span>
        </Link>
      ))}
    </div>
  );
}

export default Collections;
