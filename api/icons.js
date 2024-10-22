const { readFileSync } = require('fs');
const path = require('path');

export default function handler(req, res) {
  try {
    // Caminho para o arquivo JSON com os ícones
    const filePath = path.resolve('dist', 'icons.json');
    
    // Log para verificar o caminho do arquivo
    console.log('Caminho do arquivo:', filePath);
    
    // Lê o arquivo JSON que contém os ícones
    const icons = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // Log para verificar o conteúdo dos ícones
    console.log('Ícones lidos:', icons);
    
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

    // Retorna os SVGs renderizados como uma string
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svgList.join(' ')); // Envia os SVGs concatenados
  } catch (error) {
    console.error('Erro ao ler ou processar ícones:', error);
    res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
  }
}