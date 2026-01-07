import { I18n } from 'i18n-js';
import en from './en.json';
import gj from './gj.json';
import hi from './hi.json';
import kn from './kn.json';
import mh from './mh.json';
import tl from './tl.json';
import tn from './tn.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const i18n = new I18n({
  en,
  gj,
  hi,
  kn,
  mh,
  tl,
  tn,
});

// Set default locale
i18n.defaultLocale = 'en';

// Initialize with default language, will be updated after loading from storage
i18n.locale = 'en';

// Function to load saved language from storage
export const loadLocale = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('@app_language');
    if (savedLang) {
      i18n.locale = savedLang;
    }
    return savedLang || 'en';
  } catch (error) {
    console.error('Error loading language from storage', error);
    return 'en';
  }
};

// Function to set and persist language
export const setLocale = async (langCode: string) => {
  try {
    i18n.locale = langCode;
    await AsyncStorage.setItem('@app_language', langCode);
  } catch (error) {
    console.error('Error saving language preference', error);
  }
};

export const translate = (key: string, options?: any) => i18n.t(key, options);

// Call loadLocale when the module is imported to initialize the language
// Note: This is a one-time load when the app starts
loadLocale().then(lang => {
  i18n.locale = lang;
});