const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static('uploads'));


// SERVIDOR
app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000');
});