import React from 'react';

import DropdownMenu from '../DropdownMenu';

function PagesMenu({ isOpen, reference }) {
  const options = [
    {
      label: 'Home',
      pagePath: '/'
    },
    {
      label: 'Collections',
      pagePath: '/collections'
    },
    {
      label: "Your NFT'S",
      pagePath: '/your-nfts'
    }
  ];
  return <DropdownMenu isOpen={isOpen} options={options} reference={reference} />;
}

export default PagesMenu;
