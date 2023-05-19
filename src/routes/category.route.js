import express from 'express';
import categoryController from '../controllers/CategoryController.js';
const router = express.Router();

router.get('/:id', categoryController.index)

export default router;
