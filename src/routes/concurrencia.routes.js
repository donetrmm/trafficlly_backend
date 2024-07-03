import express from 'express';
import {
  createConcurrencia,
  deleteConcurrencia,
  getConcurrenciaByDate
} from '../controllers/concurrencia.controller.js';
import verificarJWT from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/', verificarJWT, createConcurrencia);
router.delete('/:fecha', verificarJWT, deleteConcurrencia);
router.get('/', verificarJWT, getConcurrenciaByDate);

export default router;
