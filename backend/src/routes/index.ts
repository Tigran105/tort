import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';
import {
  createCake,
  deleteCake,
  getCakeById,
  getCakes,
  updateCake,
} from '../controllers/cakeController';
import { createNamedAttributeController } from '../controllers/attributeController';
import {
  createSize,
  createTier,
  deleteSize,
  deleteTier,
  getSizeById,
  getSizes,
  getTierById,
  getTiers,
  updateSize,
  updateTier,
} from '../controllers/builderController';
import {
  createOrder,
  getBuilderOptions,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';

const router = Router();

const fruitController = createNamedAttributeController('fruit', 'Մրգը չի գտնվել');
const nutController = createNamedAttributeController('nut', 'Ընդեղենը չի գտնվել');
const fillingController = createNamedAttributeController('filling', 'Միջուկը չի գտնվել');

router.get('/builder-options', getBuilderOptions);

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/cakes', getCakes);
router.get('/cakes/:id', getCakeById);
router.post('/cakes', createCake);
router.put('/cakes/:id', updateCake);
router.delete('/cakes/:id', deleteCake);

router.get('/fruits', fruitController.getAll);
router.get('/fruits/:id', fruitController.getById);
router.post('/fruits', fruitController.create);
router.put('/fruits/:id', fruitController.update);
router.delete('/fruits/:id', fruitController.remove);

router.get('/nuts', nutController.getAll);
router.get('/nuts/:id', nutController.getById);
router.post('/nuts', nutController.create);
router.put('/nuts/:id', nutController.update);
router.delete('/nuts/:id', nutController.remove);

router.get('/fillings', fillingController.getAll);
router.get('/fillings/:id', fillingController.getById);
router.post('/fillings', fillingController.create);
router.put('/fillings/:id', fillingController.update);
router.delete('/fillings/:id', fillingController.remove);

router.get('/sizes', getSizes);
router.get('/sizes/:id', getSizeById);
router.post('/sizes', createSize);
router.put('/sizes/:id', updateSize);
router.delete('/sizes/:id', deleteSize);

router.get('/tiers', getTiers);
router.get('/tiers/:id', getTierById);
router.post('/tiers', createTier);
router.put('/tiers/:id', updateTier);
router.delete('/tiers/:id', deleteTier);

router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;
