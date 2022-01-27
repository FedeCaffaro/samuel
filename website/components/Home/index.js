import React from 'react';
import i18next from 'i18next';

import styles from './styles.module.scss';

function Home() {
  return (
    <div className={styles.center}>
      <span className={styles.text}>{i18next.t('Home:helloWorld')}</span>
      <button type="button" className={styles.connect}>
        {i18next.t('Home:connectWallet')}
      </button>
    </div>
  );
}

export default Home;
