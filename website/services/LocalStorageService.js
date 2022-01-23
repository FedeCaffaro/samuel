const tempStorage = {};

const encodeKey = (key) => window?.btoa(key);

const decodeKey = (key) => window?.atob(key);

const getValue = (key) => {
  const encodedKey = encodeKey(key);
  let encodedValue = undefined;

  try {
    encodedValue = window.localStorage.getItem(encodedKey);
  } catch (e) {
    encodedValue = tempStorage[encodedKey];
  }
  const stringValue = encodedValue && decodeKey(encodedValue);

  return stringValue && JSON.parse(stringValue);
};

const setValue = (key, value) => {
  const encodedKey = encodeKey(key);
  const stringValue = JSON.stringify(value);
  const encodedValue = encodeKey(stringValue);

  try {
    // eslint-disable-next-line babel/no-unused-expressions
    window?.localStorage?.setItem(encodedKey, encodedValue);
  } catch (e) {
    tempStorage[encodedKey] = encodedValue;
  }
};

const removeValue = (key) => {
  const encodedKey = encodeKey(key);

  try {
    window.localStorage.removeItem(encodedKey);
  } catch (e) {
    tempStorage[encodedKey] = undefined;
  }
};

const defineProperty = (prop, defaultKey = '', tag = '') => {
  const capitalizedKey = `${prop[0].toUpperCase()}${prop.substring(1)}`;

  module.exports[`set${capitalizedKey}`] = (val, key = defaultKey) =>
    setValue(`@@SAMOT:${prop}${tag}${key}`, val);
  module.exports[`get${capitalizedKey}`] = (key = defaultKey) => getValue(`@@SAMOT:${prop}${tag}${key}`);
  module.exports[`remove${capitalizedKey}`] = (key = defaultKey) =>
    removeValue(`@@SAMOT:${prop}${tag}${key}`);
};

// ------------------------------ LOCAL STORAGE PROPERTIES ------------------------------
defineProperty('tokenManager');
defineProperty('loginRedirectUrl');

const APP_KEY = '@@SAMOT';

const languageKey = `${APP_KEY}:language`;
export const setLanguage = (value) => setValue(languageKey, value);
export const getLanguage = () => getValue(languageKey);
export const removeLanguage = () => removeValue(languageKey);
