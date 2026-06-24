import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma/client';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Գրառումը չի գտնվել',
      });
      return;
    }

    if (err.code === 'P2002') {
      res.status(400).json({
        success: false,
        message: 'Այդ արժեքը արդեն գոյություն ունի',
      });
      return;
    }
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Սերվերի սխալ',
  });
}
