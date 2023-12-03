import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { OthersService } from './others.service';
import {
  bannersFilterableFields,
  recommendationsFilterableFields,
} from './others.constant';
import { IBanner, IRecommendations } from './others.interface';

const getAllRecommendation = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, recommendationsFilterableFields);
  const result = await OthersService.getAllRecommendation(
    filters,
    paginationOptions
  );

  sendResponse<IRecommendations[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recommendations fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getAllBanner = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, bannersFilterableFields);
  const result = await OthersService.getAllBanner(filters, paginationOptions);

  sendResponse<IBanner[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banners fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const createBanner: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await OthersService.createBanner(payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Banner created successfully!',
      data: result,
    });
  }
);
const getSingleBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await OthersService.findSingleActiveBanner();

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active Banner fetched successfully',
    data: result,
  });
});
const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OthersService.updateBannersKeepOneActive(id);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner updated  successfully',
    data: result,
  });
});
const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  await OthersService.deleteBanner(id);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Banner deleted  successfully',
    data: null,
  });
});
const findCoupon = catchAsync(async (req: Request, res: Response) => {
  const { couponCode } = req.body;

  const result = await OthersService.findCoupon(couponCode);

  sendResponse<IBanner>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon fetched  successfully',
    data: result,
  });
});
export const OtherController = {
  getAllRecommendation,
  getAllBanner,
  createBanner,
  getSingleBanner,
  updateBanner,
  findCoupon,
  deleteBanner,
};
