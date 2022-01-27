import React from 'react';

import MyNfts from '../components/MyNfts';
import Navbar from '../components/Navbar';
import { MENU_OPTIONS } from '../components/Navbar/constants';

export default () => (
  <>
    <Navbar selected={MENU_OPTIONS.COLLECTIONS} />
    <MyNfts />
  </>
);
