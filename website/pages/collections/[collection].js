import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Navbar from '../../components/Navbar';
import { ROUTES } from '../../constants/routes';
import { DROPS } from '../../constants/drops';
import Collection from '../../components/Collection';
import { isValidCollectionPath } from '../../utils/collections';

function CollectionPage() {
  const router = useRouter();
  const { collection: name } = router.query;

  const collection = useMemo(() => DROPS.find(({ href }) => href === `/collections/${name}`), [name]);

  useEffect(() => {
    if (name && !isValidCollectionPath(router.asPath)) {
      router.push(ROUTES.HOME.pagePath);
    }
  }, [name]);

  return (
    <>
      <Navbar selected={ROUTES.COLECTION} />
      <Collection collection={collection} />
    </>
  );
}

export default CollectionPage;
