import express from 'express';
import {
  createProbabilidad,
  deleteProbabilidad,
  getProbabilidadByDate
} from '../controllers/probabilidad.controller.js';
import verificarJWT from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post('/', verificarJWT, createProbabilidad);
router.delete('/:fecha', verificarJWT, deleteProbabilidad);
router.get('/', verificarJWT, getProbabilidadByDate);

export default router;
