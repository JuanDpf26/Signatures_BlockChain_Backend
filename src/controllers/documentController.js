const pool = require('../config/db');
const crypto = require('crypto');

// SUBIR DOCUMENTO
exports.uploadDocument = async (req, res) => {
  const { nombre } = req.body;
  const usuario_id = req.user.id;

  try {
    const fileBuffer = req.file.buffer;

    // Generar hash SHA-256
    const hash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');

    const result = await pool.query(
      'INSERT INTO documentos (usuario_id, nombre_archivo, hash) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, nombre, hash]
    );

    res.json({
      message: 'Documento subido',
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LISTAR DOCUMENTOS
exports.getDocuments = async (req, res) => {
  const usuario_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM documentos WHERE usuario_id = $1',
      [usuario_id]
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR ESTADO
exports.updateEstado = async (req, res) => {
  const { id, estado } = req.body;

  try {
    await pool.query(
      'UPDATE documentos SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    res.json({ message: 'Estado actualizado' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};