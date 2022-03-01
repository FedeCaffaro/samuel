import React from 'react';

import DropdownMenu from '../DropdownMenu';

import { COMMUNITY_OPTIONS } from './constants';
import styles from './styles.module.scss';

function CommunityMenu({ isOpen, reference, isOwner, showingLogo }) {
  return (
    <DropdownMenu
      isOpen={isOpen}
      options={COMMUNITY_OPTIONS}
      reference={reference}
      className={showingLogo ? styles['menu-left'] : styles.menu}
      isOwner={isOwner}
    />
  );
}

export default CommunityMenu;
