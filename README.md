# Tournaments Backend API

Backend API для платформы киберспортивных турниров, построенный на Node.js, Express, TypeScript и PostgreSQL.

## 🚀 Технологический стек

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker

## 📁 Структура проекта

```
src/
├── controllers/          # Контроллеры API
├── services/             # Бизнес-логика
├── middleware/           # Express middleware
├── routes/               # API маршруты
├── types/                # TypeScript типы
├── utils/                # Утилиты
├── config/               # Конфигурация
└── app.ts                # Главный файл приложения
```

## 🛠️ Установка и запуск

### Предварительные требования

- Node.js 18+
- PostgreSQL 15+
- npm или yarn

### Локальная разработка

1. **Клонирование и установка зависимостей:**
```bash
cd tournaments-back
npm install
```

2. **Настройка базы данных:**
```bash
# Создайте базу данных PostgreSQL
createdb tournaments_db

# Скопируйте файл переменных окружения
cp .env.example .env

# Отредактируйте .env файл с вашими настройками
```

3. **Настройка Prisma:**
```bash
# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:migrate

# Заполнение тестовыми данными
npm run db:seed
```

4. **Запуск в режиме разработки:**
```bash
npm run dev
```

### Docker разработка

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f app

# Остановка сервисов
docker-compose down
```

## 📚 API Документация

После запуска сервера документация API доступна по адресу:
- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

## 🔧 Доступные скрипты

```bash
# Разработка
npm run dev              # Запуск в режиме разработки
npm run build            # Сборка проекта
npm run start            # Запуск продакшен версии

# База данных
npm run db:generate      # Генерация Prisma клиента
npm run db:push          # Применение изменений схемы
npm run db:migrate       # Создание и применение миграций
npm run db:seed          # Заполнение тестовыми данными
npm run db:studio        # Открытие Prisma Studio
npm run db:reset         # Сброс базы данных

# Тестирование
npm run test             # Запуск тестов
npm run test:watch       # Запуск тестов в watch режиме
npm run test:coverage    # Запуск тестов с покрытием

# Линтинг
npm run lint             # Проверка кода
npm run lint:fix         # Автоисправление ошибок
```

## 🔐 Аутентификация

API использует JWT токены для аутентификации. Включите токен в заголовок Authorization:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Основные эндпоинты

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получение текущего пользователя
- `POST /api/auth/logout` - Выход из системы

### Турниры
- `GET /api/tournaments` - Список турниров
- `POST /api/tournaments` - Создание турнира
- `GET /api/tournaments/:id` - Детали турнира
- `PUT /api/tournaments/:id` - Обновление турнира
- `DELETE /api/tournaments/:id` - Удаление турнира
- `POST /api/tournaments/:id/join` - Регистрация на турнир

### Пользователи
- `GET /api/users/:id` - Профиль пользователя
- `PUT /api/users/:id` - Обновление профиля
- `GET /api/users/:id/tournaments` - Турниры пользователя

## 🗄️ Модели данных

### User
- id, email, username, password
- avatar, team
- createdAt, updatedAt

### Tournament
- id, title, description, game
- status, startDate, endDate
- prizePool, maxParticipants
- format, isPublic, registrationOpen
- organizerId, rules

### TournamentParticipant
- id, tournamentId, userId
- status, joinedAt

### Match
- id, tournamentId, round, matchNumber
- player1Id, player2Id
- player1Score, player2Score
- status, scheduledAt, startedAt, completedAt

## 🔒 Безопасность

- Helmet для безопасности заголовков
- CORS настройки
- Rate limiting
- Валидация входных данных
- Хеширование паролей
- JWT токены

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов с покрытием
npm run test:coverage

# Запуск тестов в watch режиме
npm run test:watch
```

## 📝 Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tournaments_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## 🚀 Деплой

### Production сборка

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t tournaments-backend .
docker run -p 3001:3001 tournaments-backend
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License