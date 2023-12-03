import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { TestService } from './test.service';
import { testFilterableFields } from './test.constant';
import { ISlot, ITest } from './test.interface';
import { number } from 'zod';

const createTest: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TestService.createTest(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Test created successfully!',
      data: result,
    });
  }
);
const getAllTest = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, testFilterableFields);
  const result = await TestService.getAllTest(filters, paginationOptions);

  sendResponse<ITest[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleTest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TestService.getSingleTest(id);

  sendResponse<ITest>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test fetched successfully',
    data: result,
  });
});
const getSlotsOfSingleTest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TestService.getSlotsOfSingleTest(id);

  sendResponse<ISlot[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test Slots fetched successfully',
    data: result,
  });
});
const updateTest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const result = await TestService.updateTest(id, data);

  sendResponse<ITest>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test updated  successfully',
    data: result,
  });
});
const getTestsFromDate = catchAsync(async (req: Request, res: Response) => {
  const { date } = req.params;
  const { page } = req.query;

  const formattedDate = new Date(date);
  const result = await TestService.getTestsFromDate(
    formattedDate,
    page ? Number(page) : 1
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tests Retrieved  successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getAllFutureTests = catchAsync(async (req: Request, res: Response) => {
  const { page } = req.query;

  const result = await TestService.getAllFutureTests(page ? Number(page) : 1);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tests Retrieved  successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleTestFromDate = catchAsync(
  async (req: Request, res: Response) => {
    const { date, id } = req.params;

    const formattedDate = new Date(date);
    const result = await TestService.getSingleTestFromDate(id, formattedDate);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Test Retrieved  successfully',

      data: result,
    });
  }
);
const deleteTest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await TestService.deleteTest(id);

  sendResponse<ITest>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test deleted  successfully',
    data: null,
  });
});

const createSlot: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await TestService.createSlot(payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Test Slot created successfully!',
      data: result,
    });
  }
);
const deleteSlot = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  const result = await TestService.deleteSlot(id);

  sendResponse<ISlot>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Test Slot deleted  successfully',
    data: result,
  });
});
const getTopTests = catchAsync(async (req: Request, res: Response) => {
  const result = await TestService.getTopTests();
  sendResponse<ITest[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top Tests Retried successfully',
    data: result,
  });
});
export const TestController = {
  createTest,
  deleteTest,
  updateTest,
  deleteSlot,
  getSingleTest,
  getSlotsOfSingleTest,
  getAllTest,
  getTopTests,
  getTestsFromDate,
  createSlot,
  getSingleTestFromDate,
  getAllFutureTests,
};
