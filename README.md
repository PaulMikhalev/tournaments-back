# Tournaments Backend API

## 📋 Обзор

Backend API для платформы киберспортивных турниров, построенный на Node.js, Express.js и TypeScript.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
npm install
```

### Настройка окружения
```bash
cp env.example .env
# Отредактируйте .env файл с вашими настройками
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
npm start
```

## 🏗️ Структура проекта

```
src/
├── controllers/           # Контроллеры API
├── models/               # Модели данных
├── routes/               # Маршруты API
├── middleware/           # Промежуточное ПО
├── services/             # Бизнес-логика
├── utils/                # Утилиты
├── config/               # Конфигурация
└── index.ts              # Точка входа
```

## 🔧 Технологический стек

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Validation**: Joi
- **Testing**: Jest

## 📚 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/refresh` - Обновление токена
- `POST /api/auth/logout` - Выход из системы

### Турниры
- `GET /api/tournaments` - Список турниров
- `GET /api/tournaments/:id` - Детали турнира
- `POST /api/tournaments` - Создание турнира
- `PUT /api/tournaments/:id` - Обновление турнира
- `DELETE /api/tournaments/:id` - Удаление турнира

### Пользователи
- `GET /api/users/profile` - Профиль пользователя
- `PUT /api/users/profile` - Обновление профиля
- `GET /api/users/:id/stats` - Статистика пользователя

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов в режиме наблюдения
npm run test:watch
```

## 📝 Линтинг

```bash
# Проверка кода
npm run lint

# Автоисправление
npm run lint:fix
```

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Валидация входных данных
- CORS настройки
- Helmet для безопасности заголовков

## 📊 База данных

### Основные сущности:
- **Users** - пользователи системы
- **Tournaments** - турниры
- **Matches** - матчи
- **Teams** - команды
- **Participants** - участники турниров

## 🚀 Развертывание

1. Установите зависимости: `npm install`
2. Настройте переменные окружения
3. Запустите миграции базы данных
4. Соберите проект: `npm run build`
5. Запустите: `npm start`

---

*Документация обновлена: 2025-01-27*