let currentLocale = 'en';

export const setFormatterLocale = (locale = 'en') => {
  currentLocale = locale;
};

export const formatNumber = (value = 0) =>
  Math.floor(value).toLocaleString(currentLocale);

export const formatFloat = (value = 0, precision = 1) =>
  Number(value || 0).toLocaleString(currentLocale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
