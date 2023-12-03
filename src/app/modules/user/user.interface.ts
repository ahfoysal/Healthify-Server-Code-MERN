/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IBooking } from '../booking/booking.interface';

export type IUser = {
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  password: string;
  userStatus?: string;
  bloodGroup?: string;
  district?: string;
  id?: string;
  _id?: string;
  upazila?: string;
  bookings?: IBooking[];
};
export type IUserFilters = {
  searchTerm?: string;

  bloodGroup?: string;
  email?: string;
  name?: string;
  role?: string;
  userStatus?: boolean;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<
    Pick<
      IUser,
      'password' | 'role' | 'email' | '_id' | 'id' | 'avatar' | 'name'
    >
  >;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;
