import React from 'react';

import Home from '../components/Home';
import Navbar from '../components/Navbar';
import { MENU_OPTIONS } from '../components/Navbar/constants';

const HomePage = () => (
  <>
    <Home />
    <Navbar selected={MENU_OPTIONS.HOME} />
  </>
);

export default HomePage;
