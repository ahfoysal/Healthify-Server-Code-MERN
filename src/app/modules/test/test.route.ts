import express from 'express';
import { TestController } from './test.controller';

const router = express.Router();

router.post(
  '/',

  TestController.createTest
);
router.get('/top', TestController.getTopTests);
router.get('/', TestController.getAllTest);
router.get('/future', TestController.getAllFutureTests);

router.get('/:id', TestController.getSingleTest);
router.get('/slot/:id', TestController.getSlotsOfSingleTest);

router.patch('/:id', TestController.updateTest);
router.delete('/:id', TestController.deleteTest);
router.delete('/slot/:id', TestController.deleteSlot);
router.post('/slot', TestController.createSlot);
router.get('/date/:date', TestController.getTestsFromDate);
router.get('/date/:id/:date', TestController.getSingleTestFromDate);

export const TestRoutes = router;
