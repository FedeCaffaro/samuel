import React from 'react';
import { useSelector } from 'react-redux';

import styles from './styles.module.scss';
import PublicHome from './components/PublicHome';
import PrivateHome from './components/PrivateHome';

function Home() {
  const wallet = useSelector((state) => state.settings.wallet);

  return (
    <div className={styles.center}>
      <div className={styles.nft}>
        <div className={styles.content}>{wallet && wallet?.account ? <PrivateHome /> : <PublicHome />}</div>
      </div>
    </div>
  );
}

export default Home;
