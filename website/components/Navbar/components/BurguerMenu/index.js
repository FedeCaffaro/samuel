import i18next from 'i18next';
import React from 'react';

import { getBurguerMenuItems, getLanguageOptions } from '../../utils';
import NavbarButton from '../NavbarButton';
import { handleChangeLanguage } from '../../../../utils/language';
import { LANGUAGES } from '../LanguageMenu/constants';
import { COMMUNITY_OPTIONS } from '../CommunityMenu/constants';
import WalletBottom from '../../../WalletBottom';

import { CLOSE_ICON } from './constants';
import styles from './styles.module.scss';

function BurgerMenu({ isOpen, handleClose, isOwner, onConnectWallet }) {
  const navbarItems = getBurguerMenuItems(onConnectWallet, isOwner);

  return isOpen ? (
    <>
      <div className={styles['fixed-container']}>
        <div className={styles['close-container']}>
          <img src={CLOSE_ICON} onClick={handleClose} className={styles['close-icon']} />
        </div>
        <div className={styles.content}>
          <div className={styles.items}>
            {navbarItems.map(({ label, ...props }) => (
              <NavbarButton key={label} text={label} isOwner={isOwner} big {...props} />
            ))}
          </div>

          <div className={styles.items}>
            <span className={styles.subtitle}>{i18next.t('Navbar:community')}</span>
            <div className={styles.options}>
              {COMMUNITY_OPTIONS.map(({ icon, label, link }) => (
                <NavbarButton
                  key={label}
                  isOwner={isOwner}
                  link={link}
                  newTab
                  icon={icon}
                  iconClassName={styles.icon}
                />
              ))}
            </div>
          </div>

          <div className={styles.items}>
            <span className={styles.subtitle}>{i18next.t('Navbar:languages')}</span>

            <div className={styles.options}>
              {LANGUAGES.map(({ value }) => (
                <NavbarButton
                  key={value}
                  text={value}
                  isOwner={isOwner}
                  onClick={handleChangeLanguage(value)}
                  big
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <WalletBottom mobile />
    </>
  ) : null;
}

export default BurgerMenu;
