import express from 'express'
const router = express.Router();
import usuarioController from '../controllers/usuarios.controller.js';
import validateUser from '../middlewares/validateUser.middleware.js';
import verificarJWT from '../middlewares/auth.middleware.js'

router.post('/', validateUser, usuarioController.createUser);
router.delete('/:correo', verificarJWT,usuarioController.deleteUser);
router.put('/:correo', verificarJWT, usuarioController.updateUser);
router.get('/', verificarJWT, usuarioController.getIDCorreo)

export default router;
