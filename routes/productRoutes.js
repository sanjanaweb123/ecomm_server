import express from 'express';
import {
  // Product api's
  createProduct,
  getProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from '../controllers/productControllers.js';

import { userAuthCheck,uploadImage } from '../utils/middleware.js';

  const router = express.Router();

  // products api's
  router.post('/createProduct', userAuthCheck,uploadImage, createProduct);
  router.post('/getProduct',  getProduct);
  router.delete('/deleteProduct/:id', userAuthCheck, deleteProduct);
  router.get('/getProductById/:id', userAuthCheck, getProductById);
  router.put('/updateProduct', userAuthCheck, updateProduct);


  export default router;
