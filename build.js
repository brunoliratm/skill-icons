const { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, copyFileSync } = require('fs');
const { join } = require('path');

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

const aliases = require('./lib/aliases.json');
const ids = [...new Set(Object.keys(icons).map(id => id.replace(/-(dark|light|auto)$/, '')))].sort();
writeFileSync(join(__dirname, 'dist', 'catalog.json'), JSON.stringify({ ids, variants: Object.keys(icons), aliases }));
for (const file of ['index.html', 'style.css', 'app.js']) {
  copyFileSync(join(__dirname, 'web', file), join(__dirname, 'dist', file));
}
copyFileSync(join(__dirname, 'favicon.ico'), join(__dirname, 'dist', 'favicon.ico'));
copyFileSync(join(__dirname, '.github', 'text-logo-light.svg'), join(__dirname, 'dist', 'wordmark.svg'));
