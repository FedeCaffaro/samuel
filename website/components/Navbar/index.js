import i18next from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { ROUTES } from '../../constants/routes';
import { useClickedOutside } from '../../hooks/useClickedOutside';

import LanguageMenu from './components/LanguageMenu';
import NavbarButton from './components/NavbarButton';
import PagesMenu from './components/PagesMenu';
import SocialMediaButtons from './components/SocialMediaButtons';
import { DROPDOWN_ICON, LOGO, MENU_ICON } from './constants';
import styles from './styles.module.scss';

function Navbar({ selected: { label: selectedMenuLabel } = ROUTES.HOME }) {
  const [isOpenLanguageModal, setIsOpenLanguageModal] = useState(false);
  const [isOpenPagesModal, setIsOpenPagesModal] = useState(false);

  const toggleLanguageModal = () => setIsOpenLanguageModal(!isOpenLanguageModal);
  const togglePagesModal = () => setIsOpenPagesModal(!isOpenPagesModal);

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
      <PagesMenu isOpen={isOpenPagesModal} reference={pagesRef} />
      <div className={styles.container}>
        <div className={styles['row-navbar']}>
          <img src={LOGO} className={styles.logo} />
          <NavbarButton text={selectedMenuLabel} icon={MENU_ICON} onClick={togglePagesModal} />
        </div>
        <div className={styles['row-navbar']}>
          <NavbarButton
            text={i18next.t('Navbar:actualLanguage')}
            icon={DROPDOWN_ICON}
            onClick={toggleLanguageModal}
          />
          <SocialMediaButtons />
        </div>
      </div>
    </>
  );
}

export default Navbar;
