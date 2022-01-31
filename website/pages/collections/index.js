import React from 'react';

import Collections from '../../components/Collections';
import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';

const CollectionsPage = () => (
  <>
    <Navbar selected={ROUTES.COLLECTIONS} />
    <Collections />
  </>
);

export default CollectionsPage;
