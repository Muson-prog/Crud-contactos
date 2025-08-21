// src/index.js
const express = require('express');
const app = express();

app.use(express.json());

// --- “Base de datos” en memoria ---
let usuarios = [
  { id: 1, nombre: 'Juan',  email: 'juan@example.com'  },
  { id: 2, nombre: 'María', email: 'maria@example.com' }
];

// --- Helpers ---
const esEmail = (str) => /\S+@\S+\.\S+/.test(str);
const toInt = (v) => Number.parseInt(v, 10);

// --- Rutas de salud y raíz ---
app.get('/', (_req, res) => {
  res.send('✅ API de Contactos/Usuarios activa. Prueba /api/usuarios');
});
app.get('/api/status', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// --- CRUD USUARIOS ---

// CREATE (POST /api/usuarios)
app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body || {};
  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'El nombre es requerido.' });
  }
  if (!email || !esEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }
  const id = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
  const nuevo = { id, nombre: nombre.trim(), email: email.trim().toLowerCase() };
  usuarios.push(nuevo);
  return res.status(201).json(nuevo);
});

// READ ALL (GET /api/usuarios)
app.get('/api/usuarios', (_req, res) => {
  res.json(usuarios);
});

// READ ONE (GET /api/usuarios/:id)
app.get('/api/usuarios/:id', (req, res) => {
  const id = toInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

// UPDATE (PUT /api/usuarios/:id)
app.put('/api/usuarios/:id', (req, res) => {
  const id = toInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { nombre, email } = req.body || {};
  if (nombre !== undefined) {
    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
      return res.status(400).json({ error: 'Nombre inválido.' });
    }
    usuario.nombre = nombre.trim();
  }
  if (email !== undefined) {
    if (!esEmail(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }
    usuario.email = email.trim().toLowerCase();
  }
  res.json(usuario);
});

// DELETE (DELETE /api/usuarios/:id)
app.delete('/api/usuarios/:id', (req, res) => {
  const id = toInt(req.params.id);
  const existe = usuarios.some(u => u.id === id);
  if (!existe) return res.status(404).json({ error: 'Usuario no encontrado' });
  usuarios = usuarios.filter(u => u.id !== id);
  res.json({ mensaje: 'Usuario eliminado' });
});

// --- 404 y manejo de errores básico ---
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;

