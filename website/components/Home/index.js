import React from 'react';
import i18next from 'i18next';

import styles from './styles.module.scss';

function Home() {
  return <span className={styles.text}>{i18next.t('Home:helloWorld')}</span>;
}

export default Home;
