import express from 'express';
import {
  createRegistro,
  deleteRegistro,
  getRegistrosByDateAndPlace,
  getSumOfPeopleByDateAndPlace
} from '../controllers/registroPersonas.controller.js';

const router = express.Router();

router.post('/', createRegistro);
router.delete('/:id', deleteRegistro);
router.get('/', getRegistrosByDateAndPlace);
router.get('/suma', getSumOfPeopleByDateAndPlace);

export default router;
