// Réexport conservé pour compatibilité.
// Toute la logique vit désormais dans `src/contexts/AuthContext.tsx` via un Provider unique.
// Ne JAMAIS recréer de listener `onAuthStateChanged` ailleurs : utiliser ce hook.
export { useAuth } from '../contexts/AuthContext';
