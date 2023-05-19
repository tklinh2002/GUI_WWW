import express from 'express';
import aboutController from '../controllers/AboutController.js';
const router = express.Router();

router.get('/', aboutController.index)

export default router;
