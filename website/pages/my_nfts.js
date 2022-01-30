import React from 'react';

import MyNfts from '../components/MyNfts';
import Navbar from '../components/Navbar';
import { ROUTES } from '../constants/routes';

const MyNftsPage = () => (
  <>
    <Navbar selected={ROUTES.MY_NFT} />
    <MyNfts />
  </>
);

export default MyNftsPage;
