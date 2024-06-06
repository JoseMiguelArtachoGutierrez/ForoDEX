const express = require('express');
const app = express();
const port = 3001;

app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola, mundo!' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});