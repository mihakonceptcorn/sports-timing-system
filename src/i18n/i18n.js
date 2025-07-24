import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import ua from '@/i18n/locales/ua.json'

function loadLocaleMessages() {
  const locales = [{ en: en }, { ua: ua }]
  const messages = {}
  locales.forEach((lang) => {
    const key = Object.keys(lang)
    messages[key] = lang[key]
  });
  return messages
}
export default createI18n({
  locale: 'en',
  fallbackLocale: 'ua',
  legacy: false,
  messages: loadLocaleMessages(),
});
