const express = require('express');
const { query } = require('../db');

const router = express.Router();

const DEFAULT_VIDEOS = [
  {
    id: 'curriculo',
    title: 'Como criar um currículo assertivo',
    duration_seconds: 45,
    display_order: 1,
  },
  {
    id: 'conexoes',
    title: 'Como se conectar com as pessoas certas',
    duration_seconds: 30,
    display_order: 2,
  },
  {
    id: 'imagem-profissional',
    title: 'De bom dia a bom dia, a sua imagem se cria',
    duration_seconds: 60,
    display_order: 3,
  },
];

let videoTablesReady;

async function ensureVideoTables() {
  if (!videoTablesReady) {
    videoTablesReady = (async () => {
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
        )
      `);

      for (const video of DEFAULT_VIDEOS) {
        await query(
          `INSERT INTO videos (id, title, duration_seconds, display_order)
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             title = VALUES(title),
             duration_seconds = VALUES(duration_seconds),
             display_order = VALUES(display_order)`,
          [video.id, video.title, video.duration_seconds, video.display_order]
        );
      }
    })();
  }

  return videoTablesReady;
}

function validateUserId(req, res, next) {
  const userId = parseInt(req.params.userId, 10);
  if (!userId) {
    return res.status(400).json({ error: 'ID de usuário inválido' });
  }

  req.userId = userId;
  next();
}

function validateVideoId(req, res, next) {
  if (!req.params.videoId) {
    return res.status(400).json({ error: 'ID de vídeo inválido' });
  }

  req.videoId = req.params.videoId;
  next();
}

async function getUserVideoProgress(userId) {
  const videos = await query(
    `SELECT
       v.id,
       v.title,
       v.duration_seconds,
       v.display_order,
       v.created_at,
       COALESCE(uvp.watched, FALSE) AS watched,
       uvp.started_at,
       uvp.finished_at
     FROM videos v
     LEFT JOIN user_video_progress uvp
       ON uvp.video_id = v.id AND uvp.user_id = ?
     ORDER BY v.display_order ASC, v.created_at ASC`,
    [userId]
  );

  const watchedCount = videos.filter((video) => Boolean(video.watched)).length;

  return {
    watchedCount,
    totalVideos: videos.length,
    videos,
  };
}

router.get('/', async (req, res, next) => {
  try {
    await ensureVideoTables();

    const videos = await query(
      'SELECT id, title, duration_seconds, display_order, created_at FROM videos ORDER BY display_order ASC, created_at ASC'
    );
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/progress', validateUserId, async (req, res, next) => {
  try {
    await ensureVideoTables();

    const progress = await getUserVideoProgress(req.userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.post('/users/:userId/:videoId/start', validateUserId, validateVideoId, async (req, res, next) => {
  try {
    await ensureVideoTables();

    const videos = await query('SELECT id FROM videos WHERE id = ?', [req.videoId]);
    if (videos.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    await query(
      `INSERT INTO user_video_progress (user_id, video_id, watched, started_at)
       VALUES (?, ?, FALSE, NOW())
       ON DUPLICATE KEY UPDATE
         started_at = COALESCE(started_at, NOW())`,
      [req.userId, req.videoId]
    );

    const progress = await getUserVideoProgress(req.userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

router.post('/users/:userId/:videoId/finish', validateUserId, validateVideoId, async (req, res, next) => {
  try {
    await ensureVideoTables();

    const videos = await query('SELECT id FROM videos WHERE id = ?', [req.videoId]);
    if (videos.length === 0) {
      return res.status(404).json({ error: 'Vídeo não encontrado' });
    }

    await query(
      `INSERT INTO user_video_progress (user_id, video_id, watched, started_at, finished_at)
       VALUES (?, ?, TRUE, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         watched = TRUE,
         started_at = COALESCE(started_at, NOW()),
         finished_at = NOW()`,
      [req.userId, req.videoId]
    );

    const progress = await getUserVideoProgress(req.userId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
