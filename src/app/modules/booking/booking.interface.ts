import { Document, Types } from 'mongoose';

export interface IBooking extends Document {
  paymentMethod: string;
  trxId: string;
  user: string | undefined | Types.ObjectId;
  slot: string | Types.ObjectId | undefined;
  test: string | Types.ObjectId | undefined;
  total: number;
  originalPrice: number;
  discountRate: number;
  couponCode: string;
  isCouponApplied: boolean;
  status: string;
  email?: string;
  feedback?: string;
  result: string;
}

export type IIBookingFilters = {
  couponCode?: string;
  status?: string;
  email?: string;
  searchTerm?: string;
};
