module.exports = (db) => {
  const express = require('express');
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM vw_emprestimos_detalhados');
      res.json(rows);
    } catch (err) {
      console.error('Erro ao buscar empréstimos detalhados:', err);
      res.status(500).json({ error: 'Erro ao buscar empréstimos detalhados' });
    }
  });

  return router;
};
