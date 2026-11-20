const { readFileSync } = require('node:fs');
const path = require('node:path');
const aliases = require('../lib/aliases.json');

let icons;

module.exports = function handler(req, res) {
  const params = new URL(req.url, 'http://localhost').searchParams;
  const limit = params.get('perline');
  if (limit !== null && (!/^[1-9]\d*$/.test(limit) || Number(limit) > 50)) {
    return res
      .status(400)
      .json({ error: 'perline must be an integer between 1 and 50.' });
  }

  try {
    icons ??= JSON.parse(
      readFileSync(path.join(process.cwd(), 'dist', 'icons.json'), 'utf8'),
    );
    const theme = params.get('theme') || params.get('t') || 'light';
    const names = (params.get('i') || params.get('icons') || '').split(',');
    const selected = [];
    for (const name of names) {
      const key = name.trim().toLowerCase();
      const id = Object.hasOwn(aliases, key) ? aliases[key] : key;
      const variant = Object.hasOwn(icons, id) ? id : `${id}-${theme}`;
      if (Object.hasOwn(icons, variant)) selected.push(icons[variant]);
    }
    if (!selected.length) {
      return res
        .status(404)
        .json({ error: 'No icons match the supplied names.' });
    }

    const columns = Math.min(
      limit === null ? selected.length : Number(limit),
      selected.length,
    );
    const rows = Math.ceil(selected.length / columns);
    const size = 48;
    const gap = 8;
    const step = size + gap;
    const width = columns * step - gap;
    const height = rows * step - gap;
    const cells = selected.map((svg, i) => {
      const x = (i % columns) * step;
      const y = Math.floor(i / columns) * step;
      // Independent SVG images keep gradient IDs and styles scoped to each cell.
      const data = Buffer.from(svg).toString('base64');
      return `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${data}"/>`;
    });
    res.setHeader('Content-Type', 'image/svg+xml');
    res
      .status(200)
      .send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${cells.join('')}</svg>`,
      );
  } catch (error) {
    console.error('Failed to load icons:', error);
    res.status(500).json({ error: 'Unable to generate the icon image.' });
  }
};
