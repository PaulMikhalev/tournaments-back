## [2025-09-22] - Типизация структуры турнирной сетки
## [2025-09-22] - Интеграция фронтенда с API (примечание)
## [2025-09-23] - Документация задач для SC6 режима (Backend)
### Добавлено
- В `docs/tasktracker.md` добавлен раздел задач по моделям и эндпоинтам для режима «Игра на вылет».

### Изменено
- —

### Исправлено
- —
### Добавлено
- Нет

### Изменено
- Уточнены CORS-настройки backend: ожидается `origin=http://localhost:3000` (значение по умолчанию).

### Исправлено
- —

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

## [2025-09-22] - Prisma enum-ы и фильтры строк
### Добавлено
- Нет

### Изменено
- В `src/types/tournament.types.ts` заменены прямые импорты enum-ов Prisma на ссылки `Tournament['status']` и `Tournament['format']` для стабильной типизации между версиями Prisma.
- В `src/services/tournaments.service.ts` удалён `mode: 'insensitive'` из строковых фильтров (`game`, `title`, `description`) для совместимости со схемой (SQLite), соответствуя типу `StringFilter`.

### Исправлено
- Ошибка компиляции: «Module '@prisma/client' has no exported member 'TournamentStatus'».
- Ошибка типов: свойство `mode` отсутствует в `StringFilter<"Tournament">`.

### Изменено
- В `src/types/api.types.ts` добавлен импорт `Request` из `express` для корректной типизации `RequestWithUser`.

### Исправлено
- Ошибка компиляции: несовместимость типов обработчиков маршрутов из-за использования DOM `Request` вместо `express.Request`.


