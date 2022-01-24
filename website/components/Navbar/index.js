import React, { useEffect, useRef, useState } from 'react';

import { useClickedOutside } from '../../hooks/useClickedOutside';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import SocialMediaButtons from './components/SocialMediaButtons';
import { DROPDOWN_ICON, LOGO, MENU_ICON } from './constants';
import styles from './styles.module.scss';

function Navbar() {
  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);

  const toggleLanguageModal = () => setIsOpenLanguageModal(!isOpenLanguageModal);

  const languagesRef = useRef(null);
  const clickedOutsideLanguages = useClickedOutside(languagesRef);

  useEffect(() => {
    if (clickedOutsideLanguages) {
      setIsOpenLanguageModal(false);
    }
  }, [clickedOutsideLanguages]);

  return (
    <>
      <LanguageMenu isOpen={isOpenLanguageModal} reference={languagesRef} />
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
