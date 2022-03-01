import i18next from 'i18next';
import React from 'react';
import Link from 'next/link';

import Stats from '../../../Stats';
import { ROUTES } from '../../../../constants/routes';

import styles from './styles.module.scss';

function PrivateHome() {
  // TODO: getName
  const name = 'holder';

  return (
    <div className={styles.container}>
      <div className={styles['first-line']}>
        <span className={styles['text-full']}>{i18next.t('Home:hi', { name })}</span>
        <div className={styles['graff-container']}>
          <span className={styles.graff}>{name}</span>
        </div>
      </div>
      <span className={styles['text-full']}>{i18next.t('Home:welcomeBack')}</span>
      <Stats owned={0} staked={0} balance={0} className={styles.stats} />
      <Link href={ROUTES.MY_NFT.pagePath}>
        <button className={styles['button-dashboard']} type="button">
          {i18next.t('Home:goToDashboard')}
        </button>
      </Link>
    </div>
  );
}

export default PrivateHome;
