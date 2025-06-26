# Stage 1: Build Angular app
FROM node:20.19.0 as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

# Stage 2: Serve static build with serve
FROM node:20.19.0-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/tms-frontend/browser ./

EXPOSE 8080

CMD ["serve", "-s", ".", "-l", "8080"]
