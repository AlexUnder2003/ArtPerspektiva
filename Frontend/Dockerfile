# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --silent

# Копируем остальные файлы приложения
COPY . .

# Пробрасываем порт, на котором работает dev-сервер Vite
EXPOSE 5173

# Запускаем dev-сервер
CMD ["npm", "run", "dev"]
