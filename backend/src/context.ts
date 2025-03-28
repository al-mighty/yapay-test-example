import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userId: string | null;
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
  const auth = req?.headers?.authorization;
  const token = auth?.replace('Bearer ', '');
  
  if (!token) {
    return { prisma, userId: null };
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return { prisma, userId: verified.userId };
  } catch {
    return { prisma, userId: null };
  }
}; 