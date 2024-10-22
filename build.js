const fs = require('fs');
const path = require('path');

// Lê todos os arquivos do diretório 'icons'
const iconsDir = fs.readdirSync('./icons');
const icons = {};

// Lê e armazena cada ícone SVG no objeto 'icons'
for (const icon of iconsDir) {
  // Obtém o nome do ícone sem a extensão
  const name = icon.replace('.svg', '').toLowerCase();
  // Lê o conteúdo do arquivo SVG e armazena no objeto
  icons[name] = String(fs.readFileSync(path.join(__dirname, 'icons', icon)));
}

// Cria o diretório 'dist' se não existir
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

// Escreve o objeto de ícones no arquivo 'icons.json' no diretório 'dist'
fs.writeFileSync(path.join(__dirname, 'dist', 'icons.json'), JSON.stringify(icons, null, 2));

console.log('Build completo: ícones gerados em dist/icons.json');
