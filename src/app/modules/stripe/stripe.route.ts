import express from 'express';
import { StripeController } from './stripe.controller';

const router = express.Router();

router.post('/', StripeController.stripePaymentIntent);

export const StripeRoutes = router;
