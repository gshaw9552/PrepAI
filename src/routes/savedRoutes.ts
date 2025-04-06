import { Router } from 'express';
import { saveQuestion, getSavedQuestions, updateSavedQuestion } from '../controllers/savedController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, saveQuestion);
router.get('/', protect, getSavedQuestions);
router.put('/:id', protect, updateSavedQuestion);

export default router;
