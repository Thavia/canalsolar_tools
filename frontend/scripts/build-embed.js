import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const publicDir = join(rootDir, 'public');

// Copiar loader.js para dist
if (existsSync(join(publicDir, 'loader.js'))) {
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  copyFileSync(
    join(publicDir, 'loader.js'),
    join(distDir, 'loader.js')
  );
  console.log('✓ loader.js copiado para dist/');
}

console.log('✓ Build do widget embedável concluído!');
console.log('\nPara usar o widget em outros sites, adicione:');
console.log('<div id="simulador"></div>');
console.log('<script src="https://tools.canalsolar.com.br/loader.js"></script>');

