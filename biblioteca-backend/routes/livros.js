const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Listar todos os livros
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM livros');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  });

  // Obter livro por ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM livros WHERE id_livro = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar livro' });
    }
  });

  // Criar novo livro
  router.post('/', async (req, res) => {
    try {
      const {
        tipo_de_material,
        numero_exemplares,
        titulo,
        autor,
        edicao,
        categoria
      } = req.body;

      const [result] = await pool.query(
        `INSERT INTO livros 
         (tipo_de_material, numero_exemplares, titulo, autor, edicao, categoria) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [tipo_de_material, numero_exemplares, titulo, autor, edicao, categoria]
      );

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao cadastrar livro' });
    }
  });

  // Atualizar livro
  router.put('/:id', async (req, res) => {
    try {
      const {
        tipo_de_material,
        numero_exemplares,
        titulo,
        autor,
        edicao,
        categoria
      } = req.body;

      const [result] = await pool.query(
        `UPDATE livros 
         SET tipo_de_material = ?, numero_exemplares = ?, titulo = ?, autor = ?, edicao = ?, categoria = ? 
         WHERE id_livro = ?`,
        [tipo_de_material, numero_exemplares, titulo, autor, edicao, categoria, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      res.json({ message: 'Livro atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  });

  // Deletar livro
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM livros WHERE id_livro = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json({ message: 'Livro deletado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar livro' });
    }
  });

  return router;
};
