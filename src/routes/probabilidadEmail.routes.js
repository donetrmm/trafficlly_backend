import express from 'express';
import { sendWeeklyReport } from '../controllers/probabilidadEmail.controller.js';

const router = express.Router();

router.post('/probabilidad', sendWeeklyReport);

export default router;
