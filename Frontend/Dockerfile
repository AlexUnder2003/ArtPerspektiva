# 1. Собираем фронтенд
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем пакеты и устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps --silent

# Копируем весь код и делаем продакшен–билд
COPY . .
RUN npm run build

# 2. Собираем nginx с уже готовыми статиками
FROM nginx:alpine

# Опционально: свой конфиг nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем результат сборки из предыдущего этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем 80-й порт
EXPOSE 80

# Запускаем nginx в форграунде
CMD ["nginx", "-g", "daemon off;"]
