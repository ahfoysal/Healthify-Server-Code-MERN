import { Document, Types } from 'mongoose';

export type IRecommendationsFilters = {
  doctorName?: string;
  searchTerm?: string;
};
export type IRecommendations = {
  doctorName?: string;
  recommendation?: string;
};

export type IBannerFilters = {
  couponCode?: string;
  searchTerm?: string;
  title?: string;
};

export type IBanner = {
  title: string;
  image: string;
  description: string;
  couponText: string;
  couponCode: string;
  discountRate: number;
  isActive: boolean;
};
