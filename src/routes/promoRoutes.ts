import express from 'express';
import { validatePromo } from '../controllers/promoController';

const router = express.Router();

router.post('/validate', validatePromo);

export default router;
