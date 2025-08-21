const express = require('express');
const app = express();

app.use(express.json()); // Para leer JSON en las peticiones

// --- Base de datos falsa en memoria ---
let usuarios = [
  { id: 1, nombre: 'Juan', email: 'juan@example.com' },
  { id: 2, nombre: 'María', email: 'maria@example.com' }
];

// --- RUTAS CRUD ---

// Crear (POST)
app.post('/api/usuarios', (req, res) => {
  const { nombre, email } = req.body;
  const nuevo = { id: usuarios.length + 1, nombre, email };
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
});

// Leer todos (GET)
app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// Leer uno por ID (GET)
app.get('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario);
});

// Actualizar (PUT)
app.put('/api/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const { nombre, email } = req.body;
  usuario.nombre = nombre || usuario.nombre;
  usuario.email = email || usuario.email;

  res.json(usuario);
});

// Eliminar (DELETE)
app.delete('/api/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  usuarios = usuarios.filter(u => u.id !== id);
  res.json({ mensaje: 'Usuario eliminado' });
});

// Exportar app para que server.js lo use
module.exports = app;

