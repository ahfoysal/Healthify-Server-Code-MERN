import express from 'express';
import { OtherController } from './others.controller';

const router = express.Router();

router.get('/recommendations', OtherController.getAllRecommendation);
router.get('/banners', OtherController.getAllBanner);
router.post('/banners', OtherController.createBanner);
router.get('/banners/active', OtherController.getSingleBanner);
router.patch('/banners/:id', OtherController.updateBanner);
router.delete('/banners/:id', OtherController.deleteBanner);
router.post('/coupon', OtherController.findCoupon);

export const OtherRoutes = router;
