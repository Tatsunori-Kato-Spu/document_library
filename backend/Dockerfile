# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app


COPY package*.json ./
RUN npm install

COPY . .

# เปิดพอร์ตให้ match กับโค้ด (ใน server.js )
EXPOSE 3001

CMD ["npm", "start"]
