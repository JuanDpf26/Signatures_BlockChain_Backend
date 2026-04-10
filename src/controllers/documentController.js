const pool = require('../config/db');
const crypto = require('crypto');

// 📤 SUBIR DOCUMENTO
exports.uploadDocument = async (req, res) => {
  const { nombre } = req.body;
  const usuario_id = req.user?.id;

  try {
    // 🔐 VALIDAR TOKEN
    if (!usuario_id) {
      return res.status(401).json({
        ok: false,
        message: "❌ Usuario no autenticado"
      });
    }

    // 📝 VALIDAR NOMBRE
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        ok: false,
        message: "⚠️ El nombre del documento es obligatorio"
      });
    }

    // 📎 VALIDAR ARCHIVO
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "⚠️ Debes seleccionar un archivo"
      });
    }

    const fileBuffer = req.file.buffer;

    // 🚫 VALIDAR DUPLICADO
    const existe = await pool.query(
      'SELECT * FROM documentos WHERE usuario_id = $1 AND nombre_archivo = $2',
      [usuario_id, nombre]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "⚠️ Ya existe un documento con ese nombre"
      });
    }

    // 🔐 HASH
    const hash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');

    const result = await pool.query(
      'INSERT INTO documentos (usuario_id, nombre_archivo, hash) VALUES ($1, $2, $3) RETURNING *',
      [usuario_id, nombre.trim(), hash]
    );

    res.status(200).json({
      ok: true,
      message: "✅ Documento subido correctamente",
      data: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "❌ Error al subir documento",
      error: error.message
    });
  }
};

// 📄 LISTAR DOCUMENTOS
exports.getDocuments = async (req, res) => {
  const usuario_id = req.user?.id;

  try {
    if (!usuario_id) {
      return res.status(401).json({
        ok: false,
        message: "❌ Usuario no autenticado"
      });
    }

    const result = await pool.query(
      'SELECT * FROM documentos WHERE usuario_id = $1 ORDER BY id DESC',
      [usuario_id]
    );

    res.status(200).json({
      ok: true,
      message: "📂 Documentos cargados",
      data: result.rows
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "❌ Error cargando documentos",
      error: error.message
    });
  }
};

// 🔄 ACTUALIZAR ESTADO
exports.updateEstado = async (req, res) => {
  const { id, estado } = req.body;

  try {
    if (!id || !estado) {
      return res.status(400).json({
        ok: false,
        message: "⚠️ Datos incompletos"
      });
    }

    const existe = await pool.query(
      'SELECT * FROM documentos WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "⚠️ Documento no encontrado"
      });
    }

    await pool.query(
      'UPDATE documentos SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    res.status(200).json({
      ok: true,
      message: "🔄 Estado actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "❌ Error actualizando estado",
      error: error.message
    });
  }
};

// ✏️ EDITAR NOMBRE
exports.updateNombre = async (req, res) => {
  const { id, nombre } = req.body;

  try {
    // 📝 VALIDACIONES
    if (!id || !nombre || nombre.trim() === "") {
      return res.status(400).json({
        ok: false,
        message: "⚠️ Nombre inválido"
      });
    }

    const existe = await pool.query(
      'SELECT * FROM documentos WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "⚠️ Documento no encontrado"
      });
    }

    await pool.query(
      'UPDATE documentos SET nombre_archivo = $1 WHERE id = $2',
      [nombre.trim(), id]
    );

    res.status(200).json({
      ok: true,
      message: "✏️ Nombre actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "❌ Error actualizando nombre",
      error: error.message
    });
  }
};

// 🗑️ ELIMINAR DOCUMENTO
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        ok: false,
        message: "⚠️ ID requerido"
      });
    }

    const existe = await pool.query(
      'SELECT * FROM documentos WHERE id = $1',
      [id]
    );

    if (existe.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "⚠️ Documento no encontrado"
      });
    }

    await pool.query(
      'DELETE FROM documentos WHERE id = $1',
      [id]
    );

    res.status(200).json({
      ok: true,
      message: "🗑️ Documento eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "❌ Error eliminando documento",
      error: error.message
    });
  }
}; 


