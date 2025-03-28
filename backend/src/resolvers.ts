import { Context } from './context';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TransactionType, TransactionStatus } from '@prisma/client';

interface TransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}

interface UpdateStatusInput {
  id: string;
  status: TransactionStatus;
}

export const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, ctx: Context) => {
      if (!ctx.userId) throw new Error('Not authenticated');
      return ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
    transactions: async (_parent: unknown, args: {
      type?: TransactionType;
      status?: TransactionStatus;
      startDate?: string;
      endDate?: string;
    }, ctx: Context) => {
      if (!ctx.userId) throw new Error('Not authenticated');
      
      const where = {
        userId: ctx.userId,
        ...(args.type && { type: args.type }),
        ...(args.status && { status: args.status }),
        ...(args.startDate && args.endDate && {
          date: {
            gte: new Date(args.startDate),
            lte: new Date(args.endDate),
          },
        }),
      };

      return ctx.prisma.transaction.findMany({ where });
    },
  },
  
  Mutation: {
    signup: async (_parent: unknown, args: { email: string; password: string; name: string }, ctx: Context) => {
      const password = await bcrypt.hash(args.password, 10);
      const user = await ctx.prisma.user.create({
        data: { ...args, password },
      });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      return { token, user };
    },

    login: async (_parent: unknown, args: { email: string; password: string }, ctx: Context) => {
      const user = await ctx.prisma.user.findUnique({ where: { email: args.email } });
      if (!user) throw new Error('No user found');
      
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) throw new Error('Invalid password');
      
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      return { token, user };
    },

    createTransaction: async (_parent: unknown, args: TransactionInput, ctx: Context) => {
      if (!ctx.userId) throw new Error('Not authenticated');
      
      return ctx.prisma.transaction.create({
        data: {
          ...args,
          date: new Date(parseInt(args.date)),
          status: TransactionStatus.PENDING,
          userId: ctx.userId,
        },
      });
    },

    updateTransactionStatus: async (_parent: unknown, args: UpdateStatusInput, ctx: Context) => {
      if (!ctx.userId) throw new Error('Not authenticated');
      
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id: args.id },
      });
      
      if (!transaction || transaction.userId !== ctx.userId) {
        throw new Error('Transaction not found or access denied');
      }
      
      return ctx.prisma.transaction.update({
        where: { id: args.id },
        data: { status: args.status },
      });
    },
  },

  User: {
    transactions: (parent: { id: string }, _args: unknown, ctx: Context) => {
      return ctx.prisma.transaction.findMany({
        where: { userId: parent.id },
      });
    },
  },
}; 