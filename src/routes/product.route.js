import express from 'express';
import productController from '../controllers/ProductController.js';
const router = express.Router();

router.get('/search', productController.search)
router.get('/:id', productController.detail)

export default router;
