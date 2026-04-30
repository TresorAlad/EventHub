/**
 * Expo CLI (@expo/cli) impose 10s pour ngrok → "ngrok tunnel took too long to connect."
 * Ce script élève le délai à 120s après chaque npm install (dépendance imbriquée expo → @expo/cli).
 */
const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(__dirname, '..', 'node_modules', 'expo', 'node_modules', '@expo', 'cli', 'build', 'src', 'start', 'server', 'AsyncNgrok.js'),
  path.join(__dirname, '..', 'node_modules', '@expo', 'cli', 'build', 'src', 'start', 'server', 'AsyncNgrok.js'),
];

const from = 'const TUNNEL_TIMEOUT = 10 * 1000;';
const to = 'const TUNNEL_TIMEOUT = 120 * 1000;';

const file = candidates.find((p) => fs.existsSync(p));
if (!file) {
  console.warn('[patch-expo-tunnel] AsyncNgrok.js introuvable (skip).');
  process.exit(0);
}

let source = fs.readFileSync(file, 'utf8');
if (source.includes(to)) {
  process.exit(0);
}
if (!source.includes(from)) {
  console.warn('[patch-expo-tunnel] Motif 10s déjà modifié ou version CLI différente (skip).');
  process.exit(0);
}

fs.writeFileSync(file, source.replace(from, to), 'utf8');
console.log('[patch-expo-tunnel] Délai tunnel ngrok porté à 120s (@expo/cli).');
