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
