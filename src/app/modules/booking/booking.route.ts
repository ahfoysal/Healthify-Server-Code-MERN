import express from 'express';
import { BookingController } from './booking.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BookingController.addBooking
);
router.get('/', auth(ENUM_USER_ROLE.ADMIN), BookingController.getAllBookings);
router.get(
  '/test/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  BookingController.getSingleBooking
);
router.get(
  '/:id',

  BookingController.getSingleBookingById
);
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  BookingController.updateBooking
);

export const BookingRoutes = router;
