const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });



router.put(
  '/estado',
  authMiddleware,
  documentController.updateEstado
);

// SUBIR
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  documentController.uploadDocument
);

// LISTAR
router.get(
  '/',
  authMiddleware,
  documentController.getDocuments
); 


router.put(
  '/nombre',
  authMiddleware,
  documentController.updateNombre
);

// 🗑️ eliminar
router.delete(
  '/:id',
  authMiddleware,
  documentController.deleteDocument
);






module.exports = router;