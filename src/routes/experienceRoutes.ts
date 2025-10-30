import express from 'express';
import { getAll, getById,createExperience } from '../controllers/experienceController';

const router = express.Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createExperience);

export default router;
