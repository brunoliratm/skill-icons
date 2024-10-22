import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

// Lê todos os arquivos do diretório 'icons'
const iconsDir = readdirSync('./icons');
const icons = {};

// Lê e armazena cada ícone SVG no objeto 'icons'
for (const icon of iconsDir) {
  // Obtém o nome do ícone sem a extensão
  const name = icon.replace('.svg', '').toLowerCase();
  // Lê o conteúdo do arquivo SVG e armazena no objeto
  icons[name] = String(readFileSync(join(__dirname, 'icons', icon)));
}

// Cria o diretório 'dist' se não existir
if (!existsSync('./dist')) {
  mkdirSync('./dist');
}

// Escreve o objeto de ícones no arquivo 'icons.json' no diretório 'dist'
writeFileSync(join(__dirname, 'dist', 'icons.json'), JSON.stringify(icons, null, 2));

console.log('Build completo: ícones gerados em dist/icons.json');
