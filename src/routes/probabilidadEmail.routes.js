import express from 'express';
import { sendWeeklyReport } from '../controllers/scheduledTaskController';

const router = express.Router();

router.post('/send-weekly-report', sendWeeklyReport);

export default router;
