import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { useClickedOutside } from '../../hooks/useClickedOutside';
import { useConnectWallet } from '../../hooks/useConnectWallet';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import PagesMenu from './components/PagesMenu';
import SocialMediaButtons from './components/SocialMediaButtons';
import { DROPDOWN_ICON, LINK_ICON, LOGO, MENU_ICON } from './constants';
import styles from './styles.module.scss';
import { getNavbarItems } from './utils';

function Navbar() {
  const { onConnectWallet } = useConnectWallet();
  const wallet = useSelector((state) => state.settings.wallet);
  const isConnected = !!wallet?.account;

  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);
  const [isOpenPagesModal, setIsOpenPagesModal] = useState(false);

  const toggleLanguageModal = () => setIsOpenLanguageModal(!isOpenLanguageModal);
  const togglePagesModal = () => setIsOpenPagesModal(!isOpenPagesModal);

  const navbarItems = getNavbarItems(
    () => toggleLanguageModal(),
    () => console.log('pages')
  );

  const languagesRef = useRef(null);
  const clickedOutsideLanguages = useClickedOutside(languagesRef);
  const pagesRef = useRef(null);
  const clickedOutsidePages = useClickedOutside(pagesRef);

  useEffect(() => {
    if (clickedOutsideLanguages) {
      setIsOpenLanguageModal(false);
    }
    if (clickedOutsidePages) {
      setIsOpenPagesModal(false);
    }
  }, [clickedOutsideLanguages, clickedOutsidePages]);

  return (
    <>
      <LanguageMenu isOpen={isOpenLanguageModal} reference={languagesRef} />
      <div className={styles.container}>
        <div className={styles['row-navbar']}>
          <div className={styles['left-container']}>
            <img src={LOGO} className={styles.logo} />
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

  // TODO: REMOVE
  // return (
  //   <>
  //     <LanguageMenu isOpen={isOpenLanguageModal} reference={languagesRef} />
  //     <PagesMenu isOpen={isOpenPagesModal} reference={pagesRef} />
  //     <div className={styles.container}>
  //       <div className={styles['row-navbar']}>
  //         <img src={LOGO} className={styles.logo} />
  //         <NavbarButton text={selectedMenuLabel} icon={MENU_ICON} onClick={togglePagesModal} />
  //       </div>

  //       <div className={styles['row-navbar']}>
  //         <NavbarButton
  //           text={i18next.t('Navbar:actualLanguage')}
  //           icon={DROPDOWN_ICON}
  //           onClick={toggleLanguageModal}
  //         />
  //         <SocialMediaButtons />
  //       </div>
  //     </div>
  //   </>
  // );
}

export default Navbar;
