require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const usersRouter = require('./routes/users');
const videosRouter = require('./routes/videos');
const quizzesRouter = require('./routes/quizzes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Express rodando' });
});

app.use('/users', usersRouter);
app.use('/videos', videosRouter);
app.use('/quizzes', quizzesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

