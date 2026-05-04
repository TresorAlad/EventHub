import { auth } from '../config/firebase';

// Cache mémoire du Firebase ID token pour éviter un appel `getIdToken()` réseau
// à chaque requête axios. Les ID tokens Firebase ont une durée de vie d'1h ;
// on rafraîchit 5 min avant l'expiration pour rester safe.
//
// Au scaling 10K users : sans cache, chaque appel API peut déclencher un round-trip
// Firebase Auth, multipliant la latence et la charge réseau.

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

type CachedToken = {
  value: string;
  exp: number;
  uid: string;
};

let cached: CachedToken | null = null;
let inflight: Promise<string | null> | null = null;

export const clearCachedIdToken = () => {
  cached = null;
  inflight = null;
};

export const getCachedIdToken = async (force = false): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    cached = null;
    return null;
  }

  // Invalide le cache si l'utilisateur courant a changé (logout/login).
  if (cached && cached.uid !== user.uid) {
    cached = null;
  }

  const now = Date.now();
  if (!force && cached && cached.exp - now > REFRESH_MARGIN_MS) {
    return cached.value;
  }

  // Dédup : si une requête de token est déjà en cours, on attend la même.
  if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    try {
      const result = await user.getIdTokenResult(force);
      cached = {
        value: result.token,
        exp: new Date(result.expirationTime).getTime(),
        uid: user.uid,
      };
      return result.token;
    } catch (err) {
      console.warn('[firebaseToken] failed to refresh token', err);
      cached = null;
      return null;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
};
