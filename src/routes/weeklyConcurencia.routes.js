import express from 'express';
import { sendDataAndSaveResponse } from '../controllers/weeklyConcurrencia.controller.js';

const router = express.Router();

router.post('/', sendDataAndSaveResponse);

export default router;
