import { Document, Schema, model, Types } from 'mongoose';
import { IBanner, IRecommendations } from './others.interface';

const RecommendationsSchema = new Schema<IRecommendations>(
  {
    doctorName: {
      type: String,
      required: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Recommendations = model<IRecommendations>(
  'Recommendations',
  RecommendationsSchema
);

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    couponText: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
    },
    discountRate: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,

      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Banner = model<IBanner>('Banner', BannerSchema);
export { Recommendations, Banner };
