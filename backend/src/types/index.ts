export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  status?: 'COMPLETED' | 'PENDING' | 'FAILED';
  startDate?: string;
  endDate?: string;
}

export interface CreateTransactionInput {
  date: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
}

export interface TransactionConnection {
  edges: Transaction[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

export interface Transaction {
  id: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: User;
} 