import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  const icons = JSON.parse(readFileSync(path.resolve('./dist/icons.json')));
  const queryIcons = req.query.i ? req.query.i.split(',') : [];
  const theme = req.query.theme || 'light';

  const result = {};
  for (const icon of queryIcons) {
    if (icons[icon]) {
      result[icon] = icons[icon];  // Pega o conteúdo SVG
    }
  }
  console.log(queryIcons);
  console.log(icons);
  res.json(result);  // Retorna os ícones solicitados
}