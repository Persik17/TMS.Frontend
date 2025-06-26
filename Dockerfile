FROM node:20.19.0

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN ng build --configuration=production --inlineFonts=false

RUN npm install -g serve

CMD ["serve", "-s", "dist/tms-frontend", "-l", "8080"]
