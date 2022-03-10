# Build phaase for react server to change the ngnix port to listen on
FROM node:16-alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

#  Run phase
FROM nginx
EXPOSE 3000
COPY ./ngnix/default.conf /etc/ngnix/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html