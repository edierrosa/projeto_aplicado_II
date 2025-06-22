CREATE DATABASE IF NOT EXISTS biblioteca_db;
USE biblioteca_db;

-- Usuários
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
    telefone VARCHAR(20),
    email VARCHAR(100),
    endereco TEXT,
    tipo_usuario ENUM('professor', 'aluno', 'técnico') NOT NULL
);

-- Livros
CREATE TABLE livros (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    tipo_de_material ENUM('livro', 'periódico', 'tese', 'dissertação', 'audiovisual') NOT NULL,
    numero_exemplares INT NOT NULL DEFAULT 1,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    edicao VARCHAR(50),
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
    categoria ENUM('romance', 'poesia', 'ciências humanas') NOT NULL
);

-- Empréstimos
CREATE TABLE emprestimos (
    id_emprestimo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT (CURRENT_DATE),
    data_prevista DATE,
    data_devolucao DATE,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    FOREIGN KEY (id_livro) REFERENCES livros(id_livro) ON DELETE RESTRICT
);

-- Trigger para calcular a data_prevista
DELIMITER //

CREATE TRIGGER set_data_prevista
BEFORE INSERT ON emprestimos
FOR EACH ROW
BEGIN
    IF NEW.data_prevista IS NULL THEN
        SET NEW.data_prevista = DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY);
    END IF;
END;
//

DELIMITER ;

-- View para informar o status calculado dos empréstimos
CREATE VIEW vw_emprestimos AS
SELECT
    e.id_emprestimo,
    e.id_usuario,
    e.id_livro,
    e.data_emprestimo,
    e.data_prevista,
    e.data_devolucao,

    CASE
        WHEN e.data_devolucao IS NOT NULL THEN 'devolvido'
        WHEN CURDATE() > e.data_prevista THEN 'atrasado'
        ELSE 'emprestado'
    END AS status_calculado
FROM emprestimos e;

-- View para calcular a disponibilidade automaticamente
CREATE OR REPLACE VIEW vw_disponibilidade AS
SELECT
  l.id_livro,
  l.titulo,
  l.autor,
  l.edicao,
  l.numero_exemplares,
  l.tipo_de_material,
  l.categoria,
  l.data_cadastro,
  (l.numero_exemplares - COUNT(e.id_emprestimo)) AS disponibilidade
FROM livros l
LEFT JOIN emprestimos e
  ON l.id_livro = e.id_livro AND e.data_devolucao IS NULL
GROUP BY l.id_livro;

-- View com detalhes de empréstimos
CREATE OR REPLACE VIEW vw_emprestimos_detalhados AS
SELECT 
  e.id_emprestimo,
  e.data_emprestimo,
  e.data_prevista,
  e.data_devolucao,
  u.id_usuario,
  u.nome_completo,
  l.id_livro,
  l.titulo,
  CASE
    WHEN e.data_devolucao IS NOT NULL THEN 'devolvido'
    WHEN CURDATE() > e.data_prevista THEN 'atrasado'
    ELSE 'emprestado'
  END AS status_calculado
FROM emprestimos e
JOIN usuarios u ON e.id_usuario = u.id_usuario
JOIN livros l ON e.id_livro = l.id_livro;
