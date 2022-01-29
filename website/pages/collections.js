import React from 'react';

import Collections from '../components/Collections';
import Navbar from '../components/Navbar';
import { MENU_OPTIONS } from '../components/Navbar/constants';

const CollectionsPage = () => (
  <>
    <Navbar selected={MENU_OPTIONS.COLLECTIONS} />
    <Collections />
  </>
);

export default CollectionsPage;
