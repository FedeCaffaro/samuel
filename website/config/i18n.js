import i18next from 'i18next';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

i18next.init({
  initImmediate: false,
  fallbackLng: 'en'
});

requireAll(require.context('..', true, /i18n\.js$/));
