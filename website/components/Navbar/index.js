import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';

import { ROUTES } from '../../constants/routes';
import { useClickedOutside } from '../../hooks/useClickedOutside';
import { useConnectWallet } from '../../hooks/useConnectWallet';
import { LOGO } from '../../constants/images-paths';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import CommunityMenu from './components/CommunityMenu';
import { BURGUER_ICON, LINK_ICON } from './constants';
import styles from './styles.module.scss';
import { getNavbarItems } from './utils';
import BurgerMenu from './components/BurguerMenu';

function Navbar({ showLogo = true }) {
  const { onConnectWallet } = useConnectWallet();
  const wallet = useSelector((state) => state.settings.wallet);
  const isConnected = !!wallet?.account;

  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);
  const [isOpenCommunityModal, setIsOpenCommunityModal] = useState(false);
  const [isOpenBurgerMenu, setIsOpenBurgerMenu] = useState(false);

  const toggleLanguageModal = () => setIsOpenLanguageModal(!isOpenLanguageModal);
  const toggleCommunityModal = () => setIsOpenCommunityModal(!isOpenCommunityModal);

  const navbarItems = getNavbarItems(toggleLanguageModal, toggleCommunityModal);

  const languagesRef = useRef(null);
  const clickedOutsideLanguages = useClickedOutside(languagesRef);
  const communityRef = useRef(null);
  const clickedOutsideCommunity = useClickedOutside(communityRef);

  useEffect(() => {
    if (clickedOutsideLanguages) {
      setIsOpenLanguageModal(false);
    }
    if (clickedOutsideCommunity) {
      setIsOpenCommunityModal(false);
    }
  }, [clickedOutsideLanguages, clickedOutsideCommunity]);

  return (
    <>
      <LanguageMenu
        isOpen={isOpenLanguageModal}
        reference={languagesRef}
        isOwner={isConnected}
        showingLogo={showLogo}
      />
      <CommunityMenu
        isOpen={isOpenCommunityModal}
        reference={communityRef}
        isOwner={isConnected}
        showingLogo={showLogo}
      />
      <BurgerMenu
        isOpen={isOpenBurgerMenu}
        isOwner={isConnected}
        handleClose={() => setIsOpenBurgerMenu(false)}
        onConnectWallet={onConnectWallet}
      />
      <div className={styles.container}>
        <div className={styles['row-navbar']}>
          <div className={styles['left-container']}>
            <img
              src={LOGO}
              className={cn(styles.logo, {
                [styles.hide]: !showLogo
              })}
            />
            <div className={styles['only-desktop']}>
              {navbarItems.map(({ label, ...props }) => (
                <NavbarButton key={label} text={label} isOwner={isConnected} {...props} />
              ))}
            </div>
          </div>
          <div className={styles['only-desktop']}>
            <NavbarButton
              text={i18next.t(`Navbar:${isConnected ? 'ownersDashboard' : 'connectWallet'}`)}
              icon={LINK_ICON}
              onClick={isConnected ? null : onConnectWallet}
              link={isConnected ? ROUTES.DASHBOARD.pagePath : null}
              iconClassName={styles['link-icon']}
              isOwner={isConnected}
            />
          </div>
          <img src={BURGUER_ICON} className={styles['menu-icon']} onClick={() => setIsOpenBurgerMenu(true)} />
        </div>
      </div>
    </>
  );
}

export default Navbar;
