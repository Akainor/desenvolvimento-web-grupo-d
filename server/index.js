const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ characters: [], rolls: [] }, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function normalizeExpression(expression = '') {
  return String(expression).replace(/\s+/g, '').toLowerCase();
}

function rollDice(expression) {
  const normalized = normalizeExpression(expression);
  const match = normalized.match(/^(\d+)d6([+-]\d+)?$/);

  if (!match) {
    return { error: 'Use o formato Xd6+Y. Exemplo: 4d6+2' };
  }

  const count = Number(match[1]);
  const modifier = Number(match[2] || 0);

  if (count < 1 || count > 30) {
    return { error: 'Use entre 1 e 30 dados.' };
  }

  const dice = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
  const successes = dice.filter((value) => value >= 4).length;
  const disasters = dice.filter((value) => value === 1).length;
  const total = dice.reduce((sum, value) => sum + value, 0) + modifier;

  return { dice, successes, disasters, modifier, total };
}

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/characters', (_req, res) => {
  const db = readDb();
  res.json(db.characters);
});

app.post('/api/characters', (req, res) => {
  const character = req.body;
  if (!character || !character.id) {
    return res.status(400).json({ error: 'Ficha inválida.' });
  }

  const db = readDb();
  const index = db.characters.findIndex((item) => item.id === character.id);
  if (index >= 0) {
    db.characters[index] = character;
  } else {
    db.characters.unshift(character);
  }
  writeDb(db);
  return res.status(201).json(character);
});

app.put('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.characters.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Ficha não encontrada.' });
  }
  db.characters[index] = { ...req.body, id };
  writeDb(db);
  return res.json(db.characters[index]);
});

app.delete('/api/characters/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.characters = db.characters.filter((item) => item.id !== id);
  writeDb(db);
  res.status(204).end();
});

app.get('/api/rolls', (_req, res) => {
  const db = readDb();
  res.json(db.rolls.slice(0, 8));
});

app.post('/api/rolls', (req, res) => {
  const { expression } = req.body || {};
  const result = rollDice(expression);

  if (result.error) {
    return res.status(400).json(result);
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    expression: normalizeExpression(expression),
    createdAt: new Date().toISOString(),
    ...result,
  };

  const db = readDb();
  db.rolls = [entry, ...db.rolls].slice(0, 8);
  writeDb(db);

  return res.status(201).json(entry);
});

app.delete('/api/rolls', (_req, res) => {
  const db = readDb();
  db.rolls = [];
  writeDb(db);
  res.status(204).end();
});

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'build');
  app.use(express.static(clientBuildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  ensureDb();
  console.log(`API Colônia disponível em http://localhost:${PORT}`);
});
