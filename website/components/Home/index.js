import React from 'react';
import Link from 'next/link';
import i18next from 'i18next';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';

import styles from './styles.module.scss';
import PublicHome from './components/PublicHome';

function Home() {
  const wallet = useSelector((state) => state.settings.wallet);

  return (
    <div className={styles.center}>
      <div className={styles.nft}>
        <div className={styles.content}>
          {wallet && wallet?.account ? (
            <>
              <Link href={ROUTES.MY_NFT.pagePath} className={styles.connect}>
                {i18next.t('Home:seeYourPortfolio')}
              </Link>
            </>
          ) : (
            <PublicHome />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
