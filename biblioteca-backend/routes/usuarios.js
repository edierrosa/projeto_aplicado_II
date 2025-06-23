const express = require('express');
const validator = require('validator');
const router = express.Router();

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf[10]);
}

module.exports = (pool) => {
  // Listar usuários com filtro de nome e cpf
  router.get('/', async (req, res) => {
    const nome = req.query.nome;
    try {
      let query = 'SELECT * FROM usuarios';
      let params = [];

      if (nome) {
        query += ' WHERE nome_completo LIKE ? OR cpf LIKE ?';
        params.push(`%${nome}%`, `%${nome}%`);
      }

      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  });

  // Obter usuário por ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  });

  // Criar novo usuário
  router.post('/', async (req, res) => {
    try {
      const { nome_completo, cpf, telefone, email, endereco, tipo_usuario } = req.body;

      // Validação
      if (!nome_completo || !cpf || !email || !tipo_usuario) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido' });
      }

      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const [result] = await pool.query(
        'INSERT INTO usuarios (nome_completo, cpf, telefone, email, endereco, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        [nome_completo, cpf, telefone, email, endereco, tipo_usuario]
      );

      res.status(201).json({ id: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  });

  // Atualizar usuário
  router.put('/:id', async (req, res) => {
    try {
      const { nome_completo, cpf, telefone, email, endereco, tipo_usuario } = req.body;

      // Validação
      if (!nome_completo || !cpf || !email || !tipo_usuario) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'E-mail inválido' });
      }

      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      const [result] = await pool.query(
        'UPDATE usuarios SET nome_completo = ?, cpf = ?, telefone = ?, email = ?, endereco = ?, tipo_usuario = ? WHERE id_usuario = ?',
        [nome_completo, cpf, telefone, email, endereco, tipo_usuario, req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  });

  // Deletar usuário
  router.delete('/:id', async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  });

  return router;
};
