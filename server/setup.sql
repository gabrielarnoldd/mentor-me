-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS arnold_db;
USE arnold_db;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_photo_url VARCHAR(500),
  reset_code VARCHAR(10) NULL,
  reset_code_expires DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar índice no email para melhorar performance de buscas
CREATE INDEX idx_email ON users(email);

CREATE TABLE IF NOT EXISTS videos (
  id VARCHAR(80) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 0,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_video_progress (
  user_id INT NOT NULL,
  video_id VARCHAR(80) NOT NULL,
  watched BOOLEAN NOT NULL DEFAULT FALSE,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id),
  CONSTRAINT fk_user_video_progress_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_video_progress_video
    FOREIGN KEY (video_id) REFERENCES videos(id)
    ON DELETE CASCADE
);

INSERT INTO videos (id, title, duration_seconds, display_order) VALUES
  ('curriculo', 'Como criar um curriculo acertivo', 45, 1),
  ('conexoes', 'Como se conectar com as pessoas certas', 30, 2),
  ('imagem-profissional', 'De bom dia a bom dia, a sua imagem se cria', 60, 3)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  duration_seconds = VALUES(duration_seconds),
  display_order = VALUES(display_order);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(80) NOT NULL,
  text VARCHAR(500) NOT NULL,
  answer VARCHAR(10) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_quiz_questions_video
    FOREIGN KEY (video_id) REFERENCES videos(id)
    ON DELETE CASCADE
);

-- Perguntas especificas de cada quiz
INSERT INTO quiz_questions (video_id, text, answer, display_order) VALUES
  ('curriculo', 'Devo colocar uma foto minha no meu curriculo?', 'no', 1),
  ('curriculo', 'Devo incluir todas as minhas experiencias?', 'yes', 2),
  ('curriculo', 'O curriculo deve passar de uma pagina?', 'no', 3),
  ('curriculo', 'Devo listar hobbies no curriculo?', 'no', 4),
  ('curriculo', 'Vale a pena incluir idiomas em qualquer nivel?', 'no', 5),
  ('curriculo', 'Devo personalizar o curriculo para cada vaga?', 'yes', 6),
  ('curriculo', 'E importante incluir referencias profissionais?', 'no', 7),
  ('curriculo', 'Devo mencionar pretensao salarial no curriculo?', 'no', 8),
  ('curriculo', 'Preciso atualizar o curriculo regularmente?', 'yes', 9),
  ('curriculo', 'Vale a pena pedir feedback sobre o curriculo?', 'yes', 10),
  ('conexoes', 'Devo manter contato com a minha rede com regularidade?', 'yes', 1),
  ('conexoes', 'Networking serve apenas quando estou procurando emprego?', 'no', 2),
  ('conexoes', 'Vale a pena ajudar pessoas da rede sem esperar retorno imediato?', 'yes', 3),
  ('conexoes', 'E util participar de eventos da minha area?', 'yes', 4),
  ('conexoes', 'Conexoes de qualidade importam mais que a quantidade?', 'yes', 5),
  ('conexoes', 'Devo me conectar apenas com pessoas do meu nivel hierarquico?', 'no', 6),
  ('conexoes', 'Vale a pena manter um perfil profissional atualizado online?', 'yes', 7),
  ('conexoes', 'Pedir indicacoes para a minha rede e algo inapropriado?', 'no', 8),
  ('imagem-profissional', 'A minha imagem profissional se constroi no dia a dia?', 'yes', 1),
  ('imagem-profissional', 'A primeira impressao pode impactar oportunidades?', 'yes', 2),
  ('imagem-profissional', 'A forma como me comunico faz parte da minha imagem?', 'yes', 3),
  ('imagem-profissional', 'Posso falar mal de antigos empregos publicamente?', 'no', 4),
  ('imagem-profissional', 'Cuidar da postura e da vestimenta e irrelevante?', 'no', 5),
  ('imagem-profissional', 'Ser pontual ajuda na minha imagem profissional?', 'yes', 6),
  ('imagem-profissional', 'As minhas redes sociais nao influenciam a imagem profissional?', 'no', 7),
  ('imagem-profissional', 'Cumprir compromissos fortalece a minha reputacao?', 'yes', 8);

CREATE TABLE IF NOT EXISTS user_quiz_results (
  user_id INT NOT NULL,
  video_id VARCHAR(80) NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  answered_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, video_id),
  CONSTRAINT fk_user_quiz_results_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_quiz_results_video
    FOREIGN KEY (video_id) REFERENCES videos(id)
    ON DELETE CASCADE
);
