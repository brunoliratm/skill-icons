import { readFileSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.resolve('dist', 'icons.json');
    
    // Log para verificar o caminho do arquivo
    console.log('Caminho do arquivo:', filePath);
    
    const icons = JSON.parse(readFileSync(filePath, 'utf8'));
    
    // Log para verificar o conteúdo dos ícones
    console.log('Ícones lidos:', icons);
    
    const queryIcons = req.query.i ? req.query.i.split(',') : [];
    const theme = req.query.theme || 'light';

    const result = {};
    for (const icon of queryIcons) {
      if (icons[icon]) {
        result[icon] = icons[icon];  // Pega o conteúdo SVG
      }
    }

    res.json(result);  // Retorna os ícones solicitados
  } catch (error) {
    console.error('Erro ao ler ou processar ícones:', error);
    res.status(500).json({ error: 'Erro interno ao processar a requisição.' });
  }
}