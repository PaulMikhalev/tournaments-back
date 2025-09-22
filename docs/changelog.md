## [2025-09-22] - Типизация структуры турнирной сетки
### Добавлено
- Локальные интерфейсы `BracketRound`, `BracketMatch` в `BracketsService`.

### Изменено
- Массивы `matches` теперь строго типизированы, исключена ошибка `never`.

### Исправлено
- Удалён несуществующий импорт `MatchStatus` из `@prisma/client`.

## [2025-09-22] - Prisma StringFilter совместимость с SQLite
### Добавлено
- Нет

### Изменено
- В `src/services/users.service.ts` удален `mode: 'insensitive'` из фильтров `contains` для полей `username`, `email`, `team`.

### Исправлено
- Ошибка типов Prisma: свойство `mode` отсутствует в `StringFilter` при использовании SQLite.

## [2025-09-22] - Типизация jsonwebtoken v9
### Добавлено
- Нет

### Изменено
- В `src/config/jwt.ts` типизированы `JWT_SECRET` как `Secret` и `expiresIn` как `SignOptions['expiresIn']`.

### Исправлено
- Ошибка перегрузки `jwt.sign`: неверные типы `secretOrPrivateKey` и `expiresIn`.

## [2025-09-22] - Нормализация nullable полей в AuthService
### Добавлено
- Нет

### Изменено
- В `src/services/auth.service.ts` поля `avatar`, `team` нормализованы с `null` к `undefined` в ответе `AuthResponse`.

### Исправлено
- Ошибка типов: `string | null` не приводился к `string | undefined` для опциональных полей пользователя.

## [2025-09-22] - Исправление типов Request
### Добавлено
- Нет

### Изменено
- В `src/types/api.types.ts` добавлен импорт `Request` из `express` для корректной типизации `RequestWithUser`.

### Исправлено
- Ошибка компиляции: несовместимость типов обработчиков маршрутов из-за использования DOM `Request` вместо `express.Request`.


