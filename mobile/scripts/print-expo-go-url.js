/**
 * Affiche les consignes Expo Go (LAN : URL locale ; TUNNEL : QR / URL affichée par Metro).
 */
const os = require('os');

const mode = (process.argv[2] || 'lan').toLowerCase();

function getLanIp() {
  const ifs = os.networkInterfaces();
  const candidates = [];
  for (const name of Object.keys(ifs)) {
    const lower = name.toLowerCase();
    if (
      lower.includes('virtualbox') ||
      lower.includes('vmware') ||
      lower.includes('hyper-v') ||
      lower.includes('vethernet')
    ) {
      continue;
    }
    for (const net of ifs[name] || []) {
      if (net.family !== 'IPv4' || net.internal) continue;
      const addr = net.address;
      if (addr.startsWith('169.254.')) continue;
      if (addr.startsWith('192.168.56.')) continue;
      candidates.push(addr);
    }
  }
  const score = (a) => (a.startsWith('10.') ? 3 : a.startsWith('192.168.') ? 2 : a.startsWith('172.') ? 1 : 0);
  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0] || '127.0.0.1';
}

console.log('');
console.log('══════════════════════════════════════════════════════════');

if (mode === 'tunnel') {
  console.log('  Mode TUNNEL (Expo Go)');
  console.log('');
  console.log('  • Laissez ce terminal ouvert : si vous l’arrêtez, l’URL *.exp.direct ne marche plus.');
  console.log('  • Attendez « Tunnel ready » puis scannez le QR affiché par Metro.');
  console.log('  • Dans Expo Go : SCAN intégré (pas l’appareil photo).');
  console.log('  • Ou : Expo Go → « Entrer l’URL » → copiez l’URL exp://… du terminal (pas une vieille URL).');
  console.log('');
  console.log('  Si erreur « ngrok tunnel took too long » :');
  console.log('    1) Compte gratuit https://dashboard.ngrok.com');
  console.log('    2) Terminal : ngrok config add-authtoken <VOTRE_TOKEN>');
  console.log('    3) Relancez : npm run start:tunnel');
  console.log('');
  console.log('  (Option) Variable d’environnement : NGROK_AUTHTOKEN=<token> avant npm run start:tunnel');
} else {
  const ip = getLanIp();
  const port = process.env.EXPO_METRO_PORT || process.env.RCT_METRO_PORT || '8081';
  const url = `exp://${ip}:${port}`;
  console.log('  Mode LAN (Expo Go) — PC et téléphone sur le même Wi‑Fi');
  console.log('');
  console.log('  Ne scannez pas avec l’appareil photo Android (souvent ouvert dans Chrome).');
  console.log('  Ouvrez Expo Go → « Entrer l’URL » et collez :');
  console.log('');
  console.log('   ', url);
  console.log('');
  console.log('  Si Metro utilise un autre port (ex. 8083), copiez l’URL exp://… du terminal');
  console.log('  ou relancez avec : $env:EXPO_METRO_PORT=\"8083\" ; npm start   (PowerShell)');
  console.log('');
  console.log('  USB Android : npm run android:reverse puis npm run android:open');
}

console.log('');
console.log('  ── Si Expo Go affiche « Packager is not running » (souvent avec *.exp.direct) ──');
console.log('  1) Sur le PC : relancez Metro (npm start en LAN, ou npm run start:tunnel).');
console.log('  2) Dans Expo Go : accueil → … sur le projet → Retirer / oublier, ou « Entrer l’URL »');
console.log('     avec l’URL tout juste affichée (ne réutilisez pas un vieux lien du tunnel).');
console.log('');

console.log('══════════════════════════════════════════════════════════');
console.log('');
