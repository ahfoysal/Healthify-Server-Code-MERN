import { Document, Schema, model, Types } from 'mongoose';
import { IBooking } from './booking.interface';

const BookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    slot: {
      type: Types.ObjectId,
      ref: 'Slot', // Reference to the Slot model
      required: true,
    },
    test: {
      type: Types.ObjectId,
      ref: 'Test', // Reference to the Slot model
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    trxId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discountRate: {
      type: Number,
    },
    couponCode: {
      type: String,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'pending',
    },
    email: {
      type: String,
      required: true,
    },

    feedback: {
      type: String,
    },
    result: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Booking = model<IBooking>('Booking', BookingSchema);
