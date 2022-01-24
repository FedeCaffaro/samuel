import React from 'react';

import { handleChangeLanguage } from '../../../../utils/language';
import DropdownMenu from '../DropdownMenu';

import { LANGUAGES } from './constants';

function LanguageMenu({ isOpen, reference }) {
  const options = LANGUAGES.map(({ label, value }) => ({
    label,
    onClick: handleChangeLanguage(value)
  }));

  return <DropdownMenu isOpen={isOpen} options={options} reference={reference} />;
}

export default LanguageMenu;
