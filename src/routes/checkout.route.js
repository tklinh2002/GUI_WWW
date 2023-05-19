import express from 'express';
import checkoutController from '../controllers/CheckoutController.js';
const router = express.Router();

router.get('/', checkoutController.index)

export default router;
