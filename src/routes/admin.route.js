import express from 'express';
import adminController from '../controllers/AdminController.js';
const router = express.Router();

router.get('/author', adminController.author)
router.get('/account', adminController.account)
router.get('/category', adminController.category)
router.get('/supplier', adminController.supplier)
router.get('/publisher', adminController.publisher)
router.get('/product', adminController.product)
router.get('/order', adminController.order)


export default router;
