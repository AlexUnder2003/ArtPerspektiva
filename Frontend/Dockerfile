# Frontend/Dockerfile

# 1) Stage: builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# 2) Stage: nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# (по желанию) ваш конфиг:
COPY nginx.conf /etc/nginx/conf.d/default.conf
