import express from 'express';

import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { TestRoutes } from '../modules/test/test.route';
import { OtherRoutes } from '../modules/others/others.route';
import { StripeRoutes } from '../modules/stripe/stripe.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { AnalysisRoutes } from '../modules/analysis/analysis.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },

  {
    path: '/test',
    route: TestRoutes,
  },

  {
    path: '/',
    route: OtherRoutes,
  },

  {
    path: '/stripe',
    route: StripeRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/analysis',
    route: AnalysisRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
