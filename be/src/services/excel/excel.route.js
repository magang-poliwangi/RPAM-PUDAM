import express from 'express';
import multer from 'multer';
import authenticateToken from '../../middlewares/authenticate-token.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default function excelRoute(excelController) {
  const router = express.Router();

  router.use(authenticateToken);

  router.get('/export', excelController.exportController);
  router.post('/import', upload.single('file'), excelController.importController);

  return router;
}