import React from 'react';

import Collections from '../components/Collections';
import Navbar from '../components/Navbar';
import { MENU_OPTIONS } from '../components/Navbar/constants';

export default () => (
  <>
    <Navbar selected={MENU_OPTIONS.COLLECTIONS} />
    <Collections />
  </>
);
