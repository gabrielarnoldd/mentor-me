const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { query } = require('../db');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'profile-photos');

fs.mkdirSync(uploadDir, { recursive: true });

let profilePhotoColumnReady;

async function ensureProfilePhotoColumn() {
  if (!profilePhotoColumnReady) {
    profilePhotoColumnReady = query('ALTER TABLE users ADD COLUMN profile_photo_url VARCHAR(500) NULL')
      .catch((error) => {
        if (error.code !== 'ER_DUP_FIELDNAME') {
          throw error;
        }
      });
  }

  return profilePhotoColumnReady;
}

function userFields(includePassword = false) {
  const fields = ['id', 'name', 'email', 'profile_photo_url', 'created_at'];
  if (includePassword) {
    fields.splice(3, 0, 'password');
  }

  return fields.join(', ');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const id = parseInt(req.params.id, 10) || 'user';
    const extension = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `${id}-${Date.now()}${extension}`);
  },
});

const uploadProfilePhoto = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype?.startsWith('image/')) {
      return cb(new Error('A foto de perfil deve ser uma imagem'));
    }

    cb(null, true);
  },
});

function validateUserId(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({ error: 'ID de usuario invalido' });
  }

  req.userId = id;
  next();
}

router.post('/login', async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha sao obrigatorios' });
    }

    const users = await query(`SELECT ${userFields(true)} FROM users WHERE email = ?`, [email]);
    const user = users[0];

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha invalidos' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'E-mail ou senha invalidos' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      profile_photo_url: user.profile_photo_url,
      created_at: user.created_at,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    const users = await query(`SELECT ${userFields()} FROM users`);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ error: 'ID de usuario invalido' });
    }

    const users = await query(`SELECT ${userFields()} FROM users WHERE id = ?`, [id]);
    const user = users[0];

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email e password sao obrigatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const newUsers = await query(`SELECT ${userFields()} FROM users WHERE id = ?`, [result.insertId]);
    res.status(201).json(newUsers[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ error: 'ID de usuario invalido' });
    }

    const { name, email, password } = req.body;
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Pelo menos um campo deve ser enviado para atualizacao' });
    }

    values.push(id);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const updatedUsers = await query(`SELECT ${userFields()} FROM users WHERE id = ?`, [id]);
    res.json(updatedUsers[0]);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/profile-photo', validateUserId, uploadProfilePhoto.single('profilePhoto'), async (req, res, next) => {
  try {
    await ensureProfilePhotoColumn();

    if (!req.file) {
      return res.status(400).json({ error: 'Envie uma imagem no campo profilePhoto' });
    }

    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    const result = await query('UPDATE users SET profile_photo_url = ? WHERE id = ?', [photoUrl, req.userId]);

    if (result.affectedRows === 0) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const updatedUsers = await query(`SELECT ${userFields()} FROM users WHERE id = ?`, [req.userId]);
    res.json(updatedUsers[0]);
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({ error: 'ID de usuario invalido' });
    }

    const result = await query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'A foto deve ter no maximo 5MB' });
    }

    return res.status(400).json({ error: error.message });
  }

  if (error.message === 'A foto de perfil deve ser uma imagem') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
});

module.exports = router;
