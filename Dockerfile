FROM node:21-alpine as dependencies
WORKDIR /app

COPY package.json .

RUN npm install;

FROM node:21-alpine as build
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm install -g @angular/cli
RUN npm run build;

FROM nginx as runner

COPY --from=build /app/dist/ng-tetris/browser /usr/share/nginx/html