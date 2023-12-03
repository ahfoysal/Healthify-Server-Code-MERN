import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BookingService } from './booking.service';
import { paginationFields } from '../../../constants/pagination';
import { bookingFilterableFields } from './booking.constant';
import pick from '../../../shared/pick';
import { IBooking } from './booking.interface';

const addBooking: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id, email }: any = req.user;

    const payload = { ...req.body, user: id, email };
    const result = await BookingService.addBooking(id, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Booked successfully!',
      data: result,
    });
  }
);

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, bookingFilterableFields);
  const result = await BookingService.getAllBookings(
    filters,
    paginationOptions
  );

  sendResponse<IBooking[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const result = await BookingService.updateBooking(id, data);

  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking updated  successfully',
    data: result,
  });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await BookingService.getSingleBooking(id);

  sendResponse<IBooking[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retried  successfully',
    data: result,
  });
});
const getSingleBookingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await BookingService.getSingleBookingById(id);

  sendResponse<IBooking>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking retried  successfully',
    data: result,
  });
});
export const BookingController = {
  getAllBookings,
  addBooking,
  updateBooking,
  getSingleBooking,
  getSingleBookingById,
};
