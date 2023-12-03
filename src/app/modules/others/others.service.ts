import httpStatus from 'http-status';

import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import mongoose, { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';

import {
  IBanner,
  IBannerFilters,
  IRecommendations,
  IRecommendationsFilters,
} from './others.interface';
import { Banner, Recommendations } from './others.model';
import {
  bannerSearchableFields,
  recommendationsSearchableFields,
} from './others.constant';

const getAllRecommendation = async (
  filters: IRecommendationsFilters,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IRecommendations[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: recommendationsSearchableFields.map(field => ({
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
  const result = await Recommendations.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Recommendations.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createBanner = async (payload: IBanner) => {
  const newBanner = await Banner.create(payload);
  return newBanner;
};
const getAllBanner = async (
  filters: IBannerFilters,
  pagination: IPaginationOptions
): Promise<IGenericResponse<IBanner[]>> => {
  const { searchTerm, ...filterData } = filters;
  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: bannerSearchableFields.map(field => ({
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
  const result = await Banner.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Banner.count();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const updateBannersKeepOneActive = async (bannerId: string) => {
  await Banner.updateMany({}, { $set: { isActive: false } });

  const result = await Banner.findByIdAndUpdate(bannerId, {
    $set: { isActive: true },
  });
  return result;
};
const deleteBanner = async (bannerId: string) => {
  const result = await Banner.findByIdAndDelete(bannerId);
  return result;
};
const findSingleActiveBanner = async () => {
  return Banner.findOne({ isActive: true });
};
const findCoupon = async (couponCode: string) => {
  const coupon = await Banner.findOne({ couponCode });

  if (!coupon) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `${couponCode} not a valid coupon.`
    );
  }

  return coupon;
};
export const OthersService = {
  getAllRecommendation,
  getAllBanner,
  createBanner,
  findSingleActiveBanner,
  updateBannersKeepOneActive,
  deleteBanner,
  findCoupon,
};
