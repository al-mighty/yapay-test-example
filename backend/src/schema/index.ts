export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: ID!
    date: String!
    type: TransactionType!
    amount: Float!
    status: TransactionStatus!
    description: String!
    userId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type TransactionConnection {
    edges: [Transaction!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }

  type AuthPayload {
    token: String!
    refreshToken: String!
    user: User!
  }

  enum TransactionType {
    INCOME
    EXPENSE
  }

  enum TransactionStatus {
    COMPLETED
    PENDING
    FAILED
  }

  input TransactionFilters {
    type: TransactionType
    status: TransactionStatus
    startDate: String
    endDate: String
  }

  input CreateTransactionInput {
    date: String!
    type: TransactionType!
    amount: Float!
    description: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    transactions(
      page: Int!
      limit: Int!
      filters: TransactionFilters
    ): TransactionConnection!
    transaction(id: ID!): Transaction!
    me: User!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    refreshToken(token: String!): AuthPayload!
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransactionStatus(
      id: ID!
      status: TransactionStatus!
    ): Transaction!
  }
`; 