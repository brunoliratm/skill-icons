const { readFileSync } = require('fs');
const path = require('path');

export default function handler(req, res) {
  try {
    // Caminho para o arquivo JSON com os ícones
    const filePath = path.resolve('dist', 'icons.json');

    // Lê o arquivo JSON que contém os ícones
    const icons = JSON.parse(readFileSync(filePath, 'utf8'));

    // Obtém os ícones da query string
    const queryIcons = req.query.i ? req.query.i.split(',') : [];
    const theme = req.query.theme || 'light';

    // Monta uma lista de SVGs para retornar, aplicando o tema se necessário
    const svgList = queryIcons
      .map(icon => {
        const iconKey = icons[icon] ? icon : `${icon}-${theme}`;
        return icons[iconKey] || null; // Retorna o SVG ou null se não encontrado
      })
      .filter(Boolean); // Remove ícones que não foram encontrados

    // Verifica se algum SVG foi encontrado
    if (svgList.length === 0) {
      return res.status(404).json({ error: 'Nenhum ícone encontrado para os nomes fornecidos.' });
    }

    // Define o tamanho desejado e a escala dos ícones
    const iconSize = 48; // Tamanho desejado para cada ícone (em pixels)
    const spacing = 8; // Espaçamento entre ícones (em pixels)
    const originalSize = 256; // Supondo que o tamanho original dos ícones seja 256px
    const scale = iconSize / originalSize; // Fator de escala para redimensionamento

    // Monta o SVG combinado com os ícones posicionados e escalados corretamente
    const combinedSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${(iconSize + spacing) * svgList.length - spacing}" height="${iconSize}">
        ${svgList.map((svg, index) => `
          <g transform="translate(${index * (iconSize + spacing)}, 0) scale(${scale})">
            ${svg}
          </g>
        `).join('')}
      </svg>
    `;

    // Retorna o SVG combinado como resposta
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(combinedSvg.trim());
  } catch (error) {
    console.error('Erro ao ler ou processar ícones:', error);
    res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
  }
}
