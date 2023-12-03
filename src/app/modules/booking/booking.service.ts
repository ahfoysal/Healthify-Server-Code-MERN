import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';

import { bookingSearchableFields } from './booking.constant';
import { IBooking, IIBookingFilters } from './booking.interface';
import { Booking } from './booking.model';
import { User } from '../user/user.model';
import { Slot } from '../test/test.model';

const addBooking = async (userID: string, payload: IBooking) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newBooking = await Booking.create([payload], { session });

    await User.findByIdAndUpdate(
      userID,
      { $push: { bookings: newBooking[0]._id } },
      { session }
    );

    await Slot.findByIdAndUpdate(
      payload.slot,
      { $inc: { bookedSlots: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newBooking[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Transaction aborted:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something Went Wrong');
  }
};
const getAllBookings = async (
  filters: IIBookingFilters,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IBooking[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: bookingSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(pagination);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Booking.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'slot',
      populate: {
        path: 'test',
      },
    })
    .populate('user');

  const total = await Booking.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getSingleBooking = async (id: string): Promise<IBooking[] | null> => {
  const result = await Booking.find({ test: id })
    .populate({
      path: 'slot',
      populate: {
        path: 'test',
      },
    })
    .populate('user');
  return result;
};
const getSingleBookingById = async (id: string): Promise<IBooking | null> => {
  const result = await Booking.findById(id)

    .populate('test')
    .populate('user')
    .populate('slot');
  return result;
};
const updateBooking = async (
  id: string,
  payload: Partial<IBooking>
): Promise<IBooking | null> => {
  const result = await Booking.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const BookingService = {
  addBooking,
  getAllBookings,
  updateBooking,
  getSingleBooking,
  getSingleBookingById,
};
