# Frontend Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5173
# Use Vite preview for simplicity in local/prod container
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
