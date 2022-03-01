import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { useClickedOutside } from '../../hooks/useClickedOutside';
import { useConnectWallet } from '../../hooks/useConnectWallet';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import CommunityMenu from './components/CommunityMenu';
import { LINK_ICON, LOGO } from './constants';
import styles from './styles.module.scss';
import { getNavbarItems } from './utils';

function Navbar({ showLogo = true }) {
  const { onConnectWallet } = useConnectWallet();
  const wallet = useSelector((state) => state.settings.wallet);
  const isConnected = !!wallet?.account;

  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);
  const [isOpenCommunityModal, setIsOpenCommunityModal] = useState(false);

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
      <div className={styles.container}>
        <div className={styles['row-navbar']}>
          <div className={styles['left-container']}>
            {showLogo && <img src={LOGO} className={styles.logo} />}
            {navbarItems.map(({ label, ...props }) => (
              <NavbarButton key={label} text={label} isOwner={isConnected} {...props} />
            ))}
          </div>
          <NavbarButton
            text={i18next.t(`Navbar:${isConnected ? 'ownersDashboard' : 'connectWallet'}`)}
            icon={LINK_ICON}
            onClick={isConnected ? null : onConnectWallet}
            link={isConnected ? ROUTES.MY_NFT.pagePath : null}
            iconClassName={styles['link-icon']}
            isOwner={isConnected}
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
