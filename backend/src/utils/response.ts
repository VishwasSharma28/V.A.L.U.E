import { Response } from 'express';

interface ApiResponseOptions {
  message?: string;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  { message = 'Success', meta }: ApiResponseOptions = {},
  status = 200
) {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendCreated<T>(res: Response, data: T, message = 'Created') {
  return sendSuccess(res, data, { message }, 201);
}

export function sendPaginated<T>(
  res: Response,
  items: T[],
  total: number,
  page: number,
  pageSize: number,
  message = 'Success'
) {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrev: page > 1,
    },
  });
}
