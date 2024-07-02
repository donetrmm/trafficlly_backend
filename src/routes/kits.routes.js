import express from 'express';
import {
  getKitById,
  getKitsByUser,
  createKit,
  updateKit,
  deleteKit
} from '../controllers/kits.controller.js';
import verificarJWT from '../middlewares/auth.middleware.js'

const router = express.Router();

router.get('/:id',verificarJWT, getKitById);
router.post('/', verificarJWT,createKit);
router.put('/:id', verificarJWT,updateKit);
router.delete('/:id', verificarJWT,deleteKit);
router.get('/usuario/unique', verificarJWT,getKitsByUser);

export default router;
