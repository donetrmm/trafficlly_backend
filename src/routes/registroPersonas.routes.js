import express from 'express';
import {
  createRegistro,
  deleteRegistro,
  getRegistrosByDateAndPlace,
  getSumOfPeopleByDateAndPlace,
  getSumOfPeopleByLastWeek
} from '../controllers/registroPersonas.controller.js';
import verificarJWT from '../middlewares/auth.middleware.js'

const router = express.Router();
router.post('/', createRegistro);
router.delete('/:id', verificarJWT, deleteRegistro);
router.get('/', verificarJWT, getRegistrosByDateAndPlace);
router.get('/suma', verificarJWT, getSumOfPeopleByDateAndPlace);
router.get('/week', verificarJWT, getSumOfPeopleByLastWeek);

export default router;
