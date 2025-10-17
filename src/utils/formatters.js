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

export const formatDuration = (seconds = 0) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;

  if (safeSeconds >= 60) {
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = Math.floor(safeSeconds % 60);
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  }

  if (safeSeconds >= 10) {
    return `${Math.round(safeSeconds)}s`;
  }

  if (safeSeconds >= 1) {
    return `${formatFloat(safeSeconds, 1)}s`;
  }

  return `${formatFloat(safeSeconds, 2)}s`;
};
