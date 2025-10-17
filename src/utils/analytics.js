const TRACKING_ID = 'G-L06KLWGC80';

function getGtag() {
  if (typeof window === 'undefined') return null;
  return window.gtag || null;
}

export function isAnalyticsAvailable() {
  return Boolean(getGtag());
}

export function ensureAnalyticsConfigured() {
  const gtag = getGtag();
  if (!gtag) return false;

  if (!window.__analyticsConfigured) {
    gtag('config', TRACKING_ID);
    window.__analyticsConfigured = true;
  }

  return true;
}

export function trackPageView(pagePath) {
  if (!ensureAnalyticsConfigured()) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
  });
}

export function trackEvent(eventName, params = {}) {
  if (!ensureAnalyticsConfigured()) return;

  window.gtag('event', eventName, params);
}

export const TRACKING_ID_CONSTANT = TRACKING_ID;
