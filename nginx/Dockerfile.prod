FROM node:14-alpine as vuejs-build

WORKDIR /vuejs

COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend .

RUN npm run build


FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=vuejs-build /vuejs/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
