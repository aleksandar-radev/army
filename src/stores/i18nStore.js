import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { messages } from '@/i18n/messages.js';
import { setFormatterLocale } from '@/utils/formatters.js';

const FALLBACK_LOCALE = 'en';
const STORAGE_KEY = 'idle-army-locale';

const localeOptions = [
  { value: 'en', labelKey: 'locales.en' },
  { value: 'es', labelKey: 'locales.es' },
  { value: 'zh', labelKey: 'locales.zh' },
];

const resolveInitialLocale = () => {
  if (typeof window === 'undefined') return FALLBACK_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && messages[stored]) return stored;
  const browser = window.navigator?.language || '';
  const short = browser.toLowerCase().slice(0, 2);
  const match = localeOptions.find((option) => option.value === short);
  return match ? match.value : FALLBACK_LOCALE;
};

const getMessage = (localeCode, key) => {
  const localeMessages = messages[localeCode] || messages[FALLBACK_LOCALE] || {};
  return key.split('.').reduce((obj, segment) => {
    if (obj && typeof obj === 'object' && segment in obj) {
      return obj[segment];
    }
    return undefined;
  }, localeMessages);
};

const formatTemplate = (template, params = {}) =>
  template.replace(/\{(\w+)\}/g, (match, name) => {
    if (params[name] === undefined || params[name] === null) {
      return match;
    }
    return String(params[name]);
  });

export const useI18nStore = defineStore('i18n', () => {
  const locale = ref(resolveInitialLocale());

  const translate = (key, params = {}, targetLocale = locale.value) => {
    const template = getMessage(targetLocale, key) ?? getMessage(FALLBACK_LOCALE, key);
    if (typeof template !== 'string') {
      return key;
    }
    return formatTemplate(template, params);
  };

  const availableLocales = localeOptions;

  const setLocale = (nextLocale) => {
    const supported = availableLocales.find((option) => option.value === nextLocale);
    locale.value = supported ? supported.value : FALLBACK_LOCALE;
  };

  const localeLabels = computed(() =>
    availableLocales.map((option) => ({
      ...option,
      label: translate(option.labelKey, {}, locale.value),
    })),
  );

  watch(
    locale,
    (value) => {
      setFormatterLocale(value);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', value);
      }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, value);
      }
    },
    { immediate: true },
  );

  return {
    locale,
    availableLocales,
    localeLabels,
    translate,
    t: translate,
    setLocale,
  };
});
