FROM node:20.19.0

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx ng build --configuration=production

RUN npm install -g serve

CMD ["serve", "-s", "dist/tms-frontend/browser", "-l", "8080"]
