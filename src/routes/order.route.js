import express from 'express';
import orderController from '../controllers/OrderController.js';
const router = express.Router();

router.get('/history', orderController.history)
router.get('/', orderController.index)

export default router;
