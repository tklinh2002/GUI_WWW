import express from 'express';
import categoryController from '../controllers/CategoryController.js';
import homeController from '../controllers/HomeController.js';
const router = express.Router();

router.get('/', homeController.index)
router.get('*', homeController.error)

export default router;
