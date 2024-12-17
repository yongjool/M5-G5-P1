import { Router } from 'express';
import { searchByKeyword } from '../controllers/search.controller.js';
const router = Router();

router.get('/search', searchByKeyword);

export default router;
