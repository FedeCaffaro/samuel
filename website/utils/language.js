import * as LocalStorageService from '../services/LocalStorageService';

export const handleChangeLanguage = (language) => () => {
  const actualLanguage = LocalStorageService.getLanguage();
  if (language !== actualLanguage) {
    LocalStorageService.setLanguage(language);
    history.go(0);
  }
};
