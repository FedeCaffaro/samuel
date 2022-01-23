import i18next from 'i18next';

import * as LocalStorageService from '../services/LocalStorageService';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

let language = '';
const DEFAULT_LANGUAGE = 'en';

try {
  language = LocalStorageService.getLanguage();
} catch {
  language = DEFAULT_LANGUAGE;
}

if (!language) {
  LocalStorageService.setLanguage(DEFAULT_LANGUAGE);
  language = DEFAULT_LANGUAGE;
}

i18next.init({
  lng: language,
  initImmediate: false,
  fallbackLng: language
});

requireAll(require.context('..', true, /i18n\.js$/));
