# Используем официальный образ Node.js для Alpine
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package.json package-lock.json* ./

# Устанавливаем зависимости (включая dev-зависимости для dev-сервера)
RUN npm install --legacy-peer-deps --silent

# Копируем весь исходный код
COPY . .

# Пробрасываем порт Vite dev-сервера
EXPOSE 5173

# Запускаем dev-сервер при старте контейнера
CMD ["npm", "run", "dev"]
