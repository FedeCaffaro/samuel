import React from 'react';
import Link from 'next/link';
import i18next from 'i18next';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { LOGO } from '../../constants/images-paths';
import { MINT_FORM_WEB } from '../../constants/links';

import styles from './styles.module.scss';

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
            <>
              <img src={LOGO} className={styles.logo} />
              <div className={styles['mint-button']}>
                <a
                  type="button"
                  className={styles.mint}
                  href={MINT_FORM_WEB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {i18next.t('Home:mint')}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
