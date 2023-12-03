import { Document, Schema, model, Types } from 'mongoose';
import { ISlot, ITest } from './test.interface';

const slotSchema = new Schema<ISlot>(
  {
    startTime: {
      type: Date,
      required: true,
    },
    numberOfSlots: {
      type: Number,
      default: 0,
      required: true,
    },

    bookedSlots: {
      type: Number,
      default: 0,
    },
    test: { type: Types.ObjectId, ref: 'Test', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Slot = model<ISlot>('Slot', slotSchema);

const testSchema = new Schema<ITest>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slots: [{ type: Types.ObjectId, ref: 'Slot' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Test = model<ITest>('Test', testSchema);

export { Slot, Test };
