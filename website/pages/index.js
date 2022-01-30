import React from 'react';

import Home from '../components/Home';
import Navbar from '../components/Navbar';
import { ROUTES } from '../constants/routes';

const HomePage = () => (
  <>
    <Home />
    <Navbar selected={ROUTES.HOME} />
  </>
);

export default HomePage;
