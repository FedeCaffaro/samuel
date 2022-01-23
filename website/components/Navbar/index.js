import React, { useState } from 'react';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import SocialMediaButtons from './components/SocialMediaButtons';
import { DROPDOWN_ICON, LOGO, MENU_ICON } from './constants';
import styles from './styles.module.scss';

function Navbar() {
  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);

  const toggleLanguageModal = () => setIsOpenLanguageModal(!isOpenLanguageModal);
  return (
    <>
      <LanguageMenu isOpen={isOpenLanguageModal} />
      <div className={styles.container}>
        <div className={styles['row-navbar']}>
          <img src={LOGO} className={styles.logo} />
          <NavbarButton text="Home" icon={MENU_ICON} />
        </div>
        <div className={styles['row-navbar']}>
          <NavbarButton text="En" icon={DROPDOWN_ICON} onClick={toggleLanguageModal} />
          <SocialMediaButtons />
        </div>
      </div>
    </>
  );
}

export default Navbar;
