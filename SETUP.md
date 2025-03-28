# Инструкция по установке и запуску

## Требования
- Node.js 18+
- Docker и Docker Compose
- PostgreSQL (если запускаете без Docker)
- Git

## Локальная разработка

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd yapay-test-example
```

### 2. Настройка окружения

#### Бэкенд (.env в папке backend)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/yapay_test_db"
JWT_SECRET="your-secret-key"
```

#### Фронтенд (.env в папке frontend)
```env
VITE_API_URL=http://localhost:4000/graphql
```

### 3. Запуск через Docker (рекомендуется)
```bash
# Запуск всех сервисов
docker compose up -d

# Проверка логов
docker compose logs -f

# Остановка
docker compose down
```

### 4. Локальный запуск

#### База данных
```bash
# Создание и запуск контейнера с PostgreSQL
docker compose up -d postgres

# Или используйте локальную PostgreSQL
createdb yapay_test_db
```

#### Бэкенд
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

#### Фронтенд
```bash
cd frontend
npm install
npm run dev
```

## Деплой

### 1. Подготовка к деплою

#### Бэкенд
```bash
cd backend
npm run build
```

#### Фронтенд
```bash
cd frontend
npm run build
```

### 2. Настройка продакшен окружения

#### Бэкенд (.env.production)
```env
DATABASE_URL="postgresql://user:password@your-db-host:5432/yapay_db"
JWT_SECRET="your-production-secret"
```

#### Фронтенд (.env.production)
```env
VITE_API_URL=https://api.your-domain.com/graphql
```

### 3. Docker деплой

1. Создайте файл `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      VITE_API_URL: ${VITE_API_URL}
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

2. Запуск в продакшене:
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Доступ к приложению

### Локальная разработка
- Фронтенд: http://localhost:5173
- GraphQL API: http://localhost:4000/graphql
- База данных: localhost:5432

### Продакшен
- Фронтенд: https://your-domain.com
- GraphQL API: https://api.your-domain.com/graphql

## Мониторинг и логи

### Docker логи
```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
```

### Проверка статуса
```bash
# Статус контейнеров
docker compose ps

# Использование ресурсов
docker stats
``` 