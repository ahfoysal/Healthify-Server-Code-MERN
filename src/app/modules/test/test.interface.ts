import { Document, Types } from 'mongoose';

export interface ISlot extends Document {
  startTime: string | Date;
  numberOfSlots: number;
  bookedSlots: number;
  test: any;
}

export interface ITest extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  slots: ISlot[];
}

export type ITestFilters = {
  name?: string;
  searchTerm?: string;
};
