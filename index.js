const { readFileSync } = require('fs');
const path = require('path');

// Carrega o JSON com os ícones
const icons = JSON.parse(readFileSync(path.resolve('dist', 'icons.json'), 'utf8'));

// Mapeamento de short names para nomes completos
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

// Corrigida para mapear os nomes curtos e aplicar tema corretamente
function parseShortNames(names, theme) {
  return names.map(name => {
    const fullName = shortNames[name] || name; // Mapeia para o nome completo, se existir
    return theme ? `${fullName}-${theme}` : fullName; // Aplica o tema se houver
  });
}

// Função para gerar o SVG com layout correto e configuração por linha
function generateSvg(iconNames, perLine = 15) {
  const iconSvgList = iconNames.map(i => icons[i]).filter(Boolean);

  if (iconSvgList.length === 0) return null;

  const ONE_ICON = 48;  // Tamanho de um ícone individual
  const ICONS_PER_LINE = Math.min(perLine, iconNames.length);  // Limita os ícones por linha

  const width = ICONS_PER_LINE * ONE_ICON;
  const height = Math.ceil(iconSvgList.length / ICONS_PER_LINE) * ONE_ICON;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${iconSvgList
        .map((svg, index) => `
          <g transform="translate(${(index % ICONS_PER_LINE) * ONE_ICON}, ${Math.floor(index / ICONS_PER_LINE) * ONE_ICON})">
            ${svg}
          </g>
        `).join('')}
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

    const perLine = parseInt(searchParams.get('perline'), 10);
    if (isNaN(perLine) || perLine < 1 || perLine > 50) {
      return new Response('Icons per line must be a number between 1 and 50', { status: 400 });
    }

    const iconShortNames = iconParam.split(',').map(name => name.trim());
    const iconNames = parseShortNames(iconShortNames, theme);

    const svg = generateSvg(iconNames, perLine);

    if (!svg) {
      return new Response("No valid icons found!", { status: 404 });
    }

    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }

  return fetch(request);
}

addEventListener('fetch', event => {
  event.respondWith(
    handleRequest(event.request).catch(
      err => new Response(err.stack, { status: 500 })
    )
  );
});
