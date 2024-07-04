import express from 'express';
import { sendMail } from '../controllers/sendEmail.controller.js';

const router = express.Router();

router.post('/send-email', sendMail);

export default router;
