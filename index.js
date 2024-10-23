const { readFileSync } = require('fs');
const path = require('path');

// Carrega o JSON com os ícones
const icons = JSON.parse(readFileSync(path.resolve('dist', 'icons.json'), 'utf8'));

const shortNames = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  tailwind: 'tailwindcss',
  vue: 'vuejs',
  nuxt: 'nuxtjs',
  go: 'golang',
  cf: 'cloudflare',
  wasm: 'webassembly',
  postgres: 'postgresql',
  k8s: 'kubernetes',
  next: 'nextjs',
  mongo: 'mongodb',
  md: 'markdown',
  ps: 'photoshop',
  ai: 'illustrator',
  pr: 'premiere',
  ae: 'aftereffects',
  scss: 'sass',
  sc: 'scala',
  net: 'dotnet',
  gatsbyjs: 'gatsby',
  gql: 'graphql',
  vlang: 'v',
  amazonwebservices: 'aws',
  bots: 'discordbots',
  express: 'expressjs',
  googlecloud: 'gcp',
  mui: 'materialui',
  windi: 'windicss',
  unreal: 'unrealengine',
  nest: 'nestjs',
  ktorio: 'ktor',
  pwsh: 'powershell',
  au: 'audition',
  rollup: 'rollupjs',
  rxjs: 'reactivex',
  rxjava: 'reactivex',
  ghactions: 'githubactions',
  sklearn: 'scikitlearn',
};

// Função para mapear os short names para nomes completos e aplicar o tema
function parseShortNames(names, theme) {
  return names.map(name => {
    const fullName = shortNames[name] || name; // Mapeia o nome curto ou usa o nome original se não houver short name
    return theme ? `${fullName}-${theme}` : fullName; // Aplica o tema, se fornecido
  });
}

// Função para gerar o SVG
function generateSvg(iconNames, perLine) {
  const iconSvgList = iconNames.map(i => icons[i]).filter(Boolean);

  if (iconSvgList.length === 0) return null;

  const ONE_ICON = 48;
  const ICONS_PER_LINE = perLine || 15;
  const SCALE = ONE_ICON / (300 - 44);

  const length = Math.min(ICONS_PER_LINE * 300, iconNames.length * 300) - 44;
  const height = Math.ceil(iconSvgList.length / ICONS_PER_LINE) * 300 - 44;
  const scaledHeight = height * SCALE;
  const scaledWidth = length * SCALE;

  return `
  <svg width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${length} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${iconSvgList
      .map((i, index) => `
        <g transform="translate(${(index % ICONS_PER_LINE) * 300}, ${Math.floor(index / ICONS_PER_LINE) * 300})">
          ${i}
        </g>
      `)
      .join('')}
  </svg>
  `.trim();
}

async function handleRequest(request) {
  const { pathname, searchParams } = new URL(request.url);
  const path = pathname.replace(/^\/|\/$/g, '');

  if (path === 'icons') {
    const iconParam = searchParams.get('i') || searchParams.get('icons');
    if (!iconParam) {
      return new Response("You didn't specify any icons!", { status: 400 });
    }

    const theme = searchParams.get('t') || searchParams.get('theme');
    if (theme && theme !== 'dark' && theme !== 'light') {
      return new Response('Theme must be either "light" or "dark"', { status: 400 });
    }

    const perLine = parseInt(searchParams.get('perline')) || 15;
    if (isNaN(perLine) || perLine < 1 || perLine > 50) {
      return new Response('Icons per line must be a number between 1 and 50', { status: 400 });
    }

    // Divide os ícones e faz o parse para nomes completos
    const iconShortNames = iconParam.split(',').map(name => name.trim());
    const iconNames = parseShortNames(iconShortNames, theme);

    // Gera o SVG
    const svg = generateSvg(iconNames, perLine);

    // Verifica se algum SVG foi gerado
    if (!svg) {
      return new Response("No valid icons found!", { status: 404 });
    }

    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }

  return fetch(request);
}

// Aqui faltava o fechamento correto da função addEventListener
addEventListener('fetch', event => {
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 })
    )
  );
});
