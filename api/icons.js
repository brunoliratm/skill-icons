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
    
    // Monta uma lista de SVGs para retornar
    const svgList = queryIcons.map(icon => {
      // Verifica se o ícone existe e se tem tema aplicado
      const iconKey = icons[icon] ? icon : `${icon}-${theme}`;
      return icons[iconKey] || null; // Retorna o SVG ou null se não encontrado
    }).filter(Boolean); // Remove ícones que não foram encontrados (null)

    // Verifica se algum SVG foi encontrado
    if (svgList.length === 0) {
      return res.status(404).json({ error: 'Nenhum ícone encontrado para os nomes fornecidos.' });
    }

    // Define o tamanho de cada ícone e a separação entre eles
    const iconSize = 100; // Tamanho desejado para cada ícone
    const spacing = 20; // Espaçamento entre ícones
    const originalSize = 256; // Supondo que o tamanho original dos ícones seja 256px
    const scale = iconSize / originalSize; // Fator de escala para redimensionar os ícones

    // Envolve os SVGs dentro de um único elemento <svg> e aplica a posição e escala corretas a cada um
    const combinedSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${(iconSize + spacing) * svgList.length}" height="${iconSize}">
        ${svgList.map((svg, index) => `
          <g transform="translate(${index * (iconSize + spacing)}, 0) scale(${scale})">
            ${svg}
          </g>
        `).join('')}
      </svg>
    `;

    // Retorna o SVG combinado
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(combinedSvg.trim()); // Envia o SVG combinado
  } catch (error) {
    console.error('Erro ao ler ou processar ícones:', error);
    res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
  }
}
