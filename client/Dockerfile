FROM node:16.8.0-alpine as build
WORKDIR /opt
COPY . ./
RUN npm install
RUN npm run build-only

FROM nginx:1.23.1
COPY --from=build /opt/dist/ /usr/share/nginx/html/
COPY ./deploy/nginx/default.conf /etc/nginx/conf.d/default.conf