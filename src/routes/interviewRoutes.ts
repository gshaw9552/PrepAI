import { Router } from 'express';
import { generateQuestion, evaluateAnswer } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';
import { storeInterviewSession } from '../controllers/interviewController';

const router = Router();

router.post('/generate', protect, generateQuestion);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/store', protect, storeInterviewSession);

export default router;
