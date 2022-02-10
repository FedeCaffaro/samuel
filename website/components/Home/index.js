import React from 'react';
import Link from 'next/link';
import i18next from 'i18next';
import { useSelector } from 'react-redux';

import { useConnectWallet } from '../../hooks/useConnectWallet';
import { ROUTES } from '../../constants/routes';

import styles from './styles.module.scss';

function Home() {
  const { onConnectWallet } = useConnectWallet();
  const wallet = useSelector((state) => state.settings.wallet);

  return (
    <div className={styles.center}>
      {wallet && wallet?.account ? (
        <>
          <span className={styles.text}>{i18next.t('Home:welcomeBack')}</span>
          <Link href={ROUTES.MY_NFT.pagePath} className={styles.connect} onClick={onConnectWallet}>
            {i18next.t('Home:seeYourPortfolio')}
          </Link>
        </>
      ) : (
        <>
          <span className={styles.text}>{i18next.t('Home:welcome')}</span>
          <button type="button" className={styles.connect} onClick={onConnectWallet}>
            {i18next.t('Home:connectWallet')}
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
