import { Response } from 'express';

export const errorResponse = (
  res: Response,
  code: number,
  data: any,
  message: string
) => {
  res.status(code).json({
    message: message || 'Internal Server Error',
    data,
    error: true
  });
};

export const successResponse = (
  res: Response,
  code: number,
  data: any,
  message: string
) => {
  res.status(code).json({
    message: message || 'Success',
    data,
    error: false
  });
};
