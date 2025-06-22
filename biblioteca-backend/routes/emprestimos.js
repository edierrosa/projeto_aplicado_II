const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Listar todos os empréstimos com status
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vw_emprestimos');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar empréstimos' });
    }
  });

  // Obter empréstimo por ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM vw_emprestimos WHERE id_emprestimo = ?', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar empréstimo' });
    }
  });

  // Criar novo empréstimo
  router.post('/', async (req, res) => {
  try {
    const { id_usuario, id_livro } = req.body;

    // Verifica disponibilidade na view
    const [livros] = await pool.query(
      'SELECT disponibilidade FROM vw_livros_disponiveis WHERE id_livro = ?',
      [id_livro]
    );

    if (livros.length === 0) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    const disponibilidade = livros[0].disponibilidade;

    if (disponibilidade < 1) {
      return res.status(400).json({ error: 'Nenhum exemplar disponível para empréstimo' });
    }

    // Se houver disponibilidade, realiza o empréstimo
    const [result] = await pool.query(
      'INSERT INTO emprestimos (id_usuario, id_livro) VALUES (?, ?)',
      [id_usuario, id_livro]
    );

    res.status(201).json({ id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar empréstimo' });
  }
});

  // Registrar devolução (atualiza data_devolucao)
  router.put('/:id', async (req, res) => {
    try {
      const dataDevolucao = new Date();
      const [result] = await pool.query(
        'UPDATE emprestimos SET data_devolucao = ? WHERE id_emprestimo = ?',
        [dataDevolucao, req.params.id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });
      res.json({ message: 'Devolução registrada com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao registrar devolução' });
    }
  });

  // Excluir empréstimo (opcional)
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM emprestimos WHERE id_emprestimo = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Empréstimo não encontrado' });
      res.json({ message: 'Empréstimo removido com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar empréstimo' });
    }
  });

  return router;
};
