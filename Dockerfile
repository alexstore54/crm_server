# Stage 1: Build image
FROM node:20-alpine3.19 AS BUILD_IMAGE

# Устанавливаем PostgreSQL client и создаем пользователя
RUN apk add --no-cache postgresql-client && adduser -D appuser

# Смена пользователя
USER appuser

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json и yarn.lock для кэширования зависимостей
COPY --chown=appuser package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем код
COPY --chown=appuser . .

# Сборка проекта
RUN yarn build

# Stage 2: Production image
FROM node:20-alpine3.19 AS PRODUCTION_IMAGE

# Устанавливаем PostgreSQL client
RUN apk add --no-cache postgresql-client

# Создаем пользователя
RUN adduser -D appuser

# Рабочая директория
WORKDIR /usr/src/app

# Копируем только нужные файлы из стадии сборки
COPY --from=BUILD_IMAGE /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/dist ./dist

# Смена пользователя
USER appuser

# Открываем порт
EXPOSE 3000

# Запуск в production-режиме
CMD ["yarn", "start:prod"]