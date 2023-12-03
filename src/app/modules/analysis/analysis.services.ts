import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { Booking } from '../booking/booking.model';
import { Test } from '../test/test.model';
import { User } from '../user/user.model';
const getAnalysis = catchAsync(async (req: Request, res: Response) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const totalBookings = await Booking.count();
  const totalTests = await Test.count();
  const totalUsers = await User.count();

  const pendingBookings = await Booking.count({ status: 'pending' });
  const pendingSum = await Booking.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const cancelledBookings = await Booking.count({ status: 'cancelled' });
  const cancelledSum = await Booking.aggregate([
    { $match: { status: 'cancelled' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const deliveredBookings = await Booking.count({ status: 'delivered' });
  const deliveredSum = await Booking.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const todayNewUsers = await User.count({
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  const todayBookings = await Booking.count({
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  const todayDeliveredBookings = await Booking.count({
    status: 'delivered',
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  const totalNewTests = await Test.count({
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });

  const totalBookingAmount = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  const todayTotalBookingAmount = await Booking.aggregate([
    { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analysis Retrieved successfully',
    data: {
      totalBookings,
      totalTests,
      totalUsers,
      pendingBookings,
      pendingSum: pendingSum.length > 0 ? pendingSum[0].total.toFixed(2) : 0,
      cancelledBookings,
      cancelledSum:
        cancelledSum.length > 0 ? cancelledSum[0].total.toFixed(2) : 0,
      deliveredBookings,
      deliveredSum:
        deliveredSum.length > 0 ? deliveredSum[0].total.toFixed(2) : 0,
      todayNewUsers,
      todayBookings,
      todayDeliveredBookings,
      totalNewTests,
      totalBookingAmount:
        totalBookingAmount.length > 0
          ? totalBookingAmount[0].total.toFixed(2)
          : 0,
      todayTotalBookingAmount:
        todayTotalBookingAmount.length > 0
          ? todayTotalBookingAmount[0].total.toFixed(2)
          : 0,
    },
  });
});

export const AnalysisServices = {
  getAnalysis,
};
