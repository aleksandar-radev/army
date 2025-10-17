export const formatNumber = (value = 0) => Math.floor(value).toLocaleString();

export const formatFloat = (value = 0, precision = 1) =>
  Number(value || 0).toFixed(precision);
