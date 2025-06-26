# Stage 1: build Angular app
FROM node:20.19.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build --configuration=production

# Stage 2: nginx serve static files
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/tms-frontend/browser /usr/share/nginx/html
