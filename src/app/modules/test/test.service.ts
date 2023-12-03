import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import mongoose, { SortOrder, startSession } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { Slot, Test } from './test.model';
import { ISlot, ITest, ITestFilters } from './test.interface';
import { testSearchableFields } from './test.constant';

const createTest = async (payload: ITest): Promise<ITest | null> => {
  const newSlot = await Test.create(payload);
  return newSlot;
};

const getAllTest = async (
  filters: ITestFilters,
  pagination: IPaginationOptions
): Promise<IGenericResponse<ITest[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: testSearchableFields.map(field => ({
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
  const result = await Test.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Test.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTest = async (id: string): Promise<ITest | null> => {
  const result = await Test.findById(id);

  return result;
};
const getAllFutureTests = async (page: number): Promise<any> => {
  const pageSize = 6;
  const currentDate = new Date();

  try {
    const tests = await Test.find()
      .populate({
        path: 'slots',
        match: { startTime: { $gte: currentDate } },
      })
      .exec();

    const filteredTests = tests.filter(test =>
      test.slots.some(slot => slot.startTime >= currentDate)
    );

    const totalTests = filteredTests.length;

    const skip = (page - 1) * pageSize;

    const paginatedTests = filteredTests.slice(skip, skip + pageSize);

    return {
      meta: {
        page,
        total: totalTests,
      },
      data: paginatedTests,
    };
  } catch (error) {
    console.error('Error fetching tests:', error);
    return null;
  }
};

const getTestsFromDate = async (date: Date, page: number): Promise<any> => {
  const pageSize = 6; // Number of tests per page

  try {
    const tests = await Test.find()
      .populate({
        path: 'slots',
        match: {
          startTime: {
            $gte: date,
            $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      })
      .exec();

    const filteredTests = tests.filter(test =>
      test.slots.some(
        slot =>
          slot.startTime >= date &&
          slot.startTime < new Date(date.getTime() + 24 * 60 * 60 * 1000)
      )
    );

    const totalTests = filteredTests.length;

    const skip = (page - 1) * pageSize;

    const paginatedTests = filteredTests.slice(skip, skip + pageSize);

    return {
      meta: {
        page,
        total: totalTests,
      },
      data: paginatedTests,
    };
  } catch (error) {
    console.error('Error fetching tests from date:', error);
    return null;
  }
};

// const getTestsFromDate = async (date: Date, page: number): Promise<any> => {
//   try {
//     const matchingSlots = await Slot.find({
//       startTime: {
//         $gte: date.toISOString(),
//         $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
//       },
//     });

//     const groupedSlots = matchingSlots.reduce((acc, slot) => {
//       acc[slot.test.toString() as any] = acc[slot.test.toString()] || [];
//       acc[slot.test.toString()].push(slot);
//       return acc;
//     }, {} as Record<string, ISlot[]>);

//     const testIds = Object.keys(groupedSlots);
//     const tests = await Test.find({ _id: { $in: testIds } });

//     const testsWithSlots = tests.map(test => ({
//       ...test.toObject(),
//       slots: groupedSlots[test._id.toString()] || [],
//     }));

//     const itemsPerPage = 6;
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const paginatedTests = testsWithSlots.slice(startIndex, endIndex);
//     return {
//       meta: {
//         page,
//         total: testsWithSlots.length,
//       },
//       data: paginatedTests,
//     };
//   } catch (error) {
//     console.error('Error fetching tests from date:', error);
//     return null;
//   }
// };
const getSingleTestFromDate = async (
  testId: string,
  date: Date
): Promise<any> => {
  try {
    const matchingSlots = await Slot.find({
      startTime: {
        $gte: date.toISOString(),
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      },
      test: testId,
    });

    const test = await Test.findById(testId);

    if (test) {
      const testWithSlots = {
        ...test.toObject(),
        slots: matchingSlots || [],
      };
      return testWithSlots;
    }
  } catch (error) {
    console.error('Error fetching single test from date:', error);
    return null;
  }
};

const updateTest = async (
  id: string,
  payload: Partial<ITest>
): Promise<ITest | null> => {
  const result = await Test.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const deleteTest = async (id: string): Promise<ITest | null> => {
  const result = await Test.findByIdAndDelete(id);
  return result;
};
const getSlotsOfSingleTest = async (
  testId: string
): Promise<ISlot[] | null> => {
  const result = await Slot.find({ test: testId });

  return result;
};
const createSlot = async (payload: ISlot) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const test = payload.test;

    const newSlot = await Slot.create(payload);

    await Test.updateOne(
      { _id: test },
      { $push: { slots: newSlot._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return newSlot;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const deleteSlot = async (id: string): Promise<ISlot | null> => {
  const result = await Slot.findByIdAndDelete(id);
  return result;
};
const getTopTests = async (): Promise<ITest[] | null> => {
  try {
    const result = await Slot.aggregate([
      {
        $group: {
          _id: '$test',
          totalBookedSlots: { $sum: '$bookedSlots' },
        },
      },
      {
        $lookup: {
          from: 'tests',
          localField: '_id',
          foreignField: '_id',
          as: 'testDetails',
        },
      },
      {
        $unwind: '$testDetails',
      },
      {
        $sort: { totalBookedSlots: -1 },
      },
      {
        $limit: 4,
      },
      {
        $project: {
          _id: '$testDetails._id',
          name: '$testDetails.name',
          description: '$testDetails.description',
          price: '$testDetails.price',
          image: '$testDetails.image',
          totalBookedSlots: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error('Error in getTopTests:', error);
    return null;
  }
};

export const TestService = {
  createTest,
  getAllTest,
  deleteTest,
  updateTest,
  getSingleTest,
  getSlotsOfSingleTest,
  createSlot,
  deleteSlot,
  getTopTests,
  getTestsFromDate,
  getSingleTestFromDate,
  getAllFutureTests,
};
