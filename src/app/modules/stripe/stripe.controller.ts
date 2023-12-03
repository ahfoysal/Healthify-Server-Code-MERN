import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import Stripe from 'stripe';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
const stripe = new Stripe(config.stripe_sk as string);
const stripePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      amount: Math.ceil(amount),
      // automatic_payment_methods: {
      //   enabled: true,
      // },
      payment_method_types: ['card'],
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Testing Route  successfully',
      data: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Error occurred while processing payment request'
    );
  }
});
export const StripeController = {
  stripePaymentIntent,
};
