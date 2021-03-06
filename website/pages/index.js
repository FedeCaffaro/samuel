import React from 'react';
import { useSelector } from 'react-redux';

import Home from '../components/Home';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const wallet = useSelector((state) => state.settings.wallet);

  return (
    <>
      <Home />
      <Navbar
        showLogo={!!wallet?.account}
        filter={wallet?.account ? () => true : (item) => item.key !== 'mint'}
      />
    </>
  );
};

export default HomePage;
