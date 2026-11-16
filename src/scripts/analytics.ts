declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
const analyticsId = document.body.dataset.analyticsId;
const banner = document.querySelector<HTMLElement>('#cookie-banner');
if (analyticsId && banner) {
  const key = 'comapo-analytics-consent';
  const readConsent = () => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const loadAnalytics = () => {
    if (document.querySelector('#analytics-script')) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.id = 'analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.append(script);
  };
  const consent = readConsent();
  if (consent === 'accepted') loadAnalytics();
  else if (consent !== 'rejected') banner.hidden = false;
  banner
    .querySelectorAll<HTMLButtonElement>('[data-consent]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.consent!;
        try {
          localStorage.setItem(key, value);
        } catch {
          /* Choice still applies for this page. */
        }
        banner.hidden = true;
        if (value === 'accepted') loadAnalytics();
        else {
          window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
          const cookiePath = import.meta.env.BASE_URL;
          document.cookie.split(';').forEach((cookie) => {
            const name = cookie.trim().split('=')[0];
            if (name === '_ga' || name.startsWith('_ga_')) {
              for (const path of ['/', cookiePath])
                document.cookie = `${name}=; Max-Age=0; path=${path}; SameSite=Lax`;
            }
          });
          document.querySelector('#analytics-script')?.remove();
        }
      });
    });
  document
    .querySelector('#cookie-preferences')
    ?.addEventListener('click', () => {
      banner.hidden = false;
      banner.querySelector('button')?.focus();
    });
}
export {};
