import { PrismaClient, TransactionType, TransactionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Создаем тестового пользователя
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Test User',
    },
  });

  // Создаем тестовые транзакции
  const transactions = [
    {
      date: new Date('2024-03-01'),
      type: TransactionType.INCOME,
      amount: 1000,
      status: TransactionStatus.COMPLETED,
      description: 'Salary',
      userId: user.id,
    },
    {
      date: new Date('2024-03-02'),
      type: TransactionType.EXPENSE,
      amount: 100,
      status: TransactionStatus.COMPLETED,
      description: 'Groceries',
      userId: user.id,
    },
    {
      date: new Date('2024-03-03'),
      type: TransactionType.EXPENSE,
      amount: 50,
      status: TransactionStatus.PENDING,
      description: 'Entertainment',
      userId: user.id,
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 