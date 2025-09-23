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
  - [x] Обновить changelog

## Задача: Интеграция фронтенда с API (примечание)
- **Статус**: Завершена
- **Описание**: Зафиксировать в документации, что фронтенд подключен к `/auth` и `/tournaments`. Проверить CORS `origin`.
- **Шаги выполнения**:
  - [x] Добавить запись в `docs/changelog.md`
  - [x] Проверить `config/app.ts` CORS `origin` (по умолчанию `http://localhost:3000`)
- **Зависимости**: `config/app`

- **Зависимости**: Маршруты и middleware, использующие `RequestWithUser`

## Задача: Устранить ошибки типов Prisma (enum-ы и StringFilter)
- **Статус**: Завершена
- **Описание**: Заменены прямые импорты enum-ов Prisma на `Tournament['status']`/`Tournament['format']`. Удалён `mode: 'insensitive'` из строковых фильтров в `TournamentsService` для совместимости с `StringFilter`.
- **Шаги выполнения**:
  - [x] Обновлён `src/types/tournament.types.ts`
  - [x] Обновлён `src/services/tournaments.service.ts`
  - [x] Проверен линтер — ошибок нет
- **Зависимости**: `@prisma/client` версия и провайдер БД (SQLite)

## Задача: Soulcalibur VI — модели и эндпоинты
- **Статус**: Планируется
- **Описание**: Добавить поддержку режима «Игра на вылет»: хранение ростеров, событий, стадий турнира и бизнес-правила.
- **Шаги выполнения**:
  - [ ] Prisma: модели `Sc6Roster`, `Sc6RosterSlot`, `Sc6Event` и связи с `Tournament`/`User`
  - [ ] Сервисы: `Sc6Service` с правилами рандома, воскрешения и допуска
  - [ ] Контроллеры/роуты: `POST /sc6/roster/init`, `POST /sc6/random`, `POST /sc6/pick`, `POST /sc6/match-events`, `GET /sc6/state`
  - [ ] Тесты (unit/e2e) и фикстуры
  - [ ] Swagger документация
- **Зависимости**: Спецификация режима в root `docs/Project.md`

