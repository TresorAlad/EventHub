let initialized = false;

/**
 * Initialise Sentry uniquement quand le runtime JS est prêt (après le premier paint).
 * Utilise `require` à l'intérieur de la fonction pour ne pas exécuter le SDK
 * pendant la phase Metro `[runtime not ready]`.
 *
 * `sentry-expo` a été retiré : il imbriquait des copies conflictuelles de `@sentry/*`
 * / `tslib` et pouvait provoquer `Cannot read property '__extends' of undefined`.
 */
export function initSentry(): void {
  if (initialized) return;
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  initialized = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native');
    Sentry.init({
      dsn,
      debug: false,
      tracesSampleRate: 0.1,
      enableAutoSessionTracking: true,
    });
  } catch (e) {
    initialized = false;
    console.warn('[Sentry] init ignorée:', e);
  }
}

export function captureException(error: unknown): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require('@sentry/react-native');
    Sentry.captureException(error);
  } catch {
    /* noop */
  }
}
