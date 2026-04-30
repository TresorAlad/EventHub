/**
 * Ouvre l'URL du projet dans Expo Go via adb (évite Chrome).
 */
const { execSync } = require('child_process');
const os = require('os');

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

const ip = getLanIp();
const port = process.env.EXPO_METRO_PORT || '8081';
const url = `exp://${ip}:${port}`;

try {
  execSync(`adb shell am start -a android.intent.action.VIEW -d "${url}"`, {
    stdio: 'inherit',
    shell: true,
  });
  console.log('Ouverture demandée dans Expo Go :', url);
} catch {
  console.error('');
  console.error('Échec adb. Vérifiez : téléphone USB, débogage USB, et que `adb` est dans le PATH.');
  console.error('URL à coller manuellement dans Expo Go :', url);
  console.error('');
  process.exit(1);
}
