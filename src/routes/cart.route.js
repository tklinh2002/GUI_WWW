import express from 'express';
import cartController from '../controllers/CartController.js';
const router = express.Router();

router.get('/', cartController.index)

export default router;
