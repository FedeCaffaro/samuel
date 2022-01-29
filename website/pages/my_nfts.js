import React from 'react';

import MyNfts from '../components/MyNfts';
import Navbar from '../components/Navbar';
import { MENU_OPTIONS } from '../components/Navbar/constants';

const MyNftsPage = () => (
  <>
    <Navbar selected={MENU_OPTIONS.COLLECTIONS} />
    <MyNfts />
  </>
);

export default MyNftsPage;
