const express = require('express');
const { query } = require('../db');

const router = express.Router();

const QUESTIONS_BY_VIDEO = {
  curriculo: [
    { text: 'Devo colocar uma foto minha no meu curriculo?', answer: 'no', display_order: 1 },
    { text: 'Devo incluir todas as minhas experiencias?', answer: 'yes', display_order: 2 },
    { text: 'O curriculo deve passar de uma pagina?', answer: 'no', display_order: 3 },
    { text: 'Devo listar hobbies no curriculo?', answer: 'no', display_order: 4 },
    { text: 'Vale a pena incluir idiomas em qualquer nivel?', answer: 'no', display_order: 5 },
    { text: 'Devo personalizar o curriculo para cada vaga?', answer: 'yes', display_order: 6 },
    { text: 'E importante incluir referencias profissionais?', answer: 'no', display_order: 7 },
    { text: 'Devo mencionar pretensao salarial no curriculo?', answer: 'no', display_order: 8 },
    { text: 'Preciso atualizar o curriculo regularmente?', answer: 'yes', display_order: 9 },
    { text: 'Vale a pena pedir feedback sobre o curriculo?', answer: 'yes', display_order: 10 },
  ],
  conexoes: [
    { text: 'Devo manter contato com a minha rede com regularidade?', answer: 'yes', display_order: 1 },
    { text: 'Networking serve apenas quando estou procurando emprego?', answer: 'no', display_order: 2 },
    { text: 'Vale a pena ajudar pessoas da rede sem esperar retorno imediato?', answer: 'yes', display_order: 3 },
    { text: 'E util participar de eventos da minha area?', answer: 'yes', display_order: 4 },
    { text: 'Conexoes de qualidade importam mais que a quantidade?', answer: 'yes', display_order: 5 },
    { text: 'Devo me conectar apenas com pessoas do meu nivel hierarquico?', answer: 'no', display_order: 6 },
    { text: 'Vale a pena manter um perfil profissional atualizado online?', answer: 'yes', display_order: 7 },
    { text: 'Pedir indicacoes para a minha rede e algo inapropriado?', answer: 'no', display_order: 8 },
  ],
  'imagem-profissional': [
    { text: 'A minha imagem profissional se constroi no dia a dia?', answer: 'yes', display_order: 1 },
    { text: 'A primeira impressao pode impactar oportunidades?', answer: 'yes', display_order: 2 },
    { text: 'A forma como me comunico faz parte da minha imagem?', answer: 'yes', display_order: 3 },
    { text: 'Posso falar mal de antigos empregos publicamente?', answer: 'no', display_order: 4 },
    { text: 'Cuidar da postura e da vestimenta e irrelevante?', answer: 'no', display_order: 5 },
    { text: 'Ser pontual ajuda na minha imagem profissional?', answer: 'yes', display_order: 6 },
    { text: 'As minhas redes sociais nao influenciam a imagem profissional?', answer: 'no', display_order: 7 },
    { text: 'Cumprir compromissos fortalece a minha reputacao?', answer: 'yes', display_order: 8 },
  ],
};

const GENERIC_QUESTIONS = QUESTIONS_BY_VIDEO.curriculo;

let quizTablesReady;

async function ensureQuizTables() {
  if (!quizTablesReady) {
    quizTablesReady = (async () => {
      await query(`
        CREATE TABLE IF NOT EXISTS videos (
          id VARCHAR(80) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          duration_seconds INT NOT NULL DEFAULT 0,
          display_order INT NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await query(`
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
        )
      `);

      await query(`
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
        )
      `);

      const videos = await query('SELECT id FROM videos ORDER BY display_order ASC, created_at ASC');
      for (const video of videos) {
        const questions = QUESTIONS_BY_VIDEO[video.id] || GENERIC_QUESTIONS;

        const existing = await query(
          'SELECT text FROM quiz_questions WHERE video_id = ? ORDER BY display_order ASC, id ASC',
          [video.id]
        );

        // Re-seed quando ainda nao ha perguntas ou quando o conjunto salvo
        // nao corresponde ao esperado (ex.: base antiga com perguntas genericas
        // duplicadas em todos os videos).
        const matches =
          existing.length === questions.length &&
          existing.every((row, i) => row.text === questions[i].text);
        if (matches) continue;

        await query('DELETE FROM quiz_questions WHERE video_id = ?', [video.id]);
        for (const question of questions) {
          await query(
            `INSERT INTO quiz_questions (video_id, text, answer, display_order)
             VALUES (?, ?, ?, ?)`,
            [video.id, question.text, question.answer, question.display_order]
          );
        }
      }
    })();
  }

  return quizTablesReady;
}

function validateUserId(req, res, next) {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) {
    return res.status(400).json({ error: 'ID de usuario invalido' });
  }

  req.userId = userId;
  next();
}

function validateVideoId(req, res, next) {
  if (!req.params.videoId) {
    return res.status(400).json({ error: 'ID de video invalido' });
  }

  req.videoId = req.params.videoId;
  next();
}

router.get('/:videoId/questions', validateVideoId, async (req, res, next) => {
  try {
    await ensureQuizTables();

    const questions = await query(
      `SELECT id, text, answer
       FROM quiz_questions
       WHERE video_id = ?
       ORDER BY display_order ASC, id ASC`,
      [req.videoId]
    );

    res.json(questions);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/results', validateUserId, async (req, res, next) => {
  try {
    await ensureQuizTables();

    const results = await query(
      `SELECT video_id, score, total, answered_at
       FROM user_quiz_results
       WHERE user_id = ?`,
      [req.userId]
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.post('/users/:userId/:videoId/results', validateUserId, validateVideoId, async (req, res, next) => {
  try {
    await ensureQuizTables();

    const score = parseInt(req.body.score, 10);
    const total = parseInt(req.body.total, 10);
    if (Number.isNaN(score) || Number.isNaN(total) || total <= 0 || score < 0 || score > total) {
      return res.status(400).json({ error: 'Resultado de quiz invalido' });
    }

    await query(
      `INSERT INTO user_quiz_results (user_id, video_id, score, total, answered_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         score = VALUES(score),
         total = VALUES(total),
         answered_at = NOW()`,
      [req.userId, req.videoId, score, total]
    );

    const rows = await query(
      `SELECT video_id, score, total, answered_at
       FROM user_quiz_results
       WHERE user_id = ? AND video_id = ?`,
      [req.userId, req.videoId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
