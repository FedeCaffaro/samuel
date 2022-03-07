import i18next from 'i18next';
import React from 'react';

import { LOGO } from '../../../../constants/images-paths';
import { MINT_FORM_WEB } from '../../../../constants/links';
import BottomPopupWithButton from '../../../BottomPopupWithButton';

import { DISCORD_LINK } from './constants';
import styles from './styles.module.scss';

function PublicHome() {
  return (
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
      <BottomPopupWithButton
        text={i18next.t('Home:discordPopup')}
        href={DISCORD_LINK}
        buttonClassname={styles.discord}
        buttonLabel={i18next.t('Home:discord')}
      />
    </>
  );
}

export default PublicHome;
