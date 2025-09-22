## Задача: Явно типизировать структуру сетки (BracketRound/BracketMatch)
- **Статус**: Завершена
- **Описание**: Исправлена ошибка `never` в массивах `matches` путём явной типизации раундов/матчей в `BracketsService`.
- **Шаги выполнения**:
  - [x] Добавлены локальные интерфейсы `BracketRound`, `BracketMatch`
  - [x] Удалён неиспользуемый импорт `MatchStatus`
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: -

## Задача: Убрать mode из Prisma StringFilter и нормализовать null-ы
- **Статус**: Завершена
- **Описание**: Для SQLite `mode: 'insensitive'` не поддерживается типами; заменены фильтры на `contains` без `mode`. Поля `avatar`, `team` нормализованы `null -> undefined`.
- **Шаги выполнения**:
  - [x] Обновлен `UsersService.searchUsers` — удален `mode`
  - [x] Приведены `avatar`, `team` к `undefined` в ответах UsersService
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: Prisma sqlite provider

## Задача: Привести типы jsonwebtoken к v9 (jwt.ts)
- **Статус**: Завершена
- **Описание**: Исправлены типы `Secret` и `expiresIn` для вызовов `jwt.sign`, чтобы устранить несовместимость перегрузок.
- **Шаги выполнения**:
  - [x] Импортированы `Secret`, `SignOptions` из `jsonwebtoken`
  - [x] Типизированы `JWT_SECRET` как `Secret`, `JWT_EXPIRES_IN` и `JWT_REFRESH_EXPIRES_IN` как `SignOptions['expiresIn']`
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: `@types/jsonwebtoken@^9`

## Задача: Привести типы AuthResponse к optional (null -> undefined)
- **Статус**: Завершена
- **Описание**: В БД поля `avatar`, `team` могут быть `null`, а в типах — опциональные. Добавлена нормализация `null` -> `undefined` в `AuthService`.
- **Шаги выполнения**:
  - [x] Обновлен `AuthService.register` возврат пользователя с `?? undefined`
  - [x] Обновлен `AuthService.login` возврат пользователя с `?? undefined`
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: `types/auth.types.ts` (`AuthResponse`)

## Задача: Исправить тип RequestWithUser (Express Request)
- **Статус**: Завершена
- **Описание**: Ошибка типов из-за отсутствия импорта `Request` из `express` в `RequestWithUser`, что приводило к конфликту с DOM Fetch `Request`.
- **Шаги выполнения**:
  - [x] Добавлен импорт `Request` из `express` в `src/types/api.types.ts`
  - [x] Проверен линтер — ошибок нет
  - [ ] Обновить changelog
- **Зависимости**: Маршруты и middleware, использующие `RequestWithUser`

## Задача: Устранить ошибки типов Prisma (enum-ы и StringFilter)
- **Статус**: Завершена
- **Описание**: Заменены прямые импорты enum-ов Prisma на `Tournament['status']`/`Tournament['format']`. Удалён `mode: 'insensitive'` из строковых фильтров в `TournamentsService` для совместимости с `StringFilter`.
- **Шаги выполнения**:
  - [x] Обновлён `src/types/tournament.types.ts`
  - [x] Обновлён `src/services/tournaments.service.ts`
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: `@prisma/client` версия и провайдер БД (SQLite)


