import i18next from 'i18next';
import React from 'react';

import styles from './styles.module.scss';

function PrivateHome() {
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

    </div>
  );
}

export default PrivateHome;
