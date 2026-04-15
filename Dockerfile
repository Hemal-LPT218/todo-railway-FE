# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install

ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Fix permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx && \
    chgrp -R 0 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html && \
    chmod -R g+rwX /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

# 🔥 Change nginx to run on 8080
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf

USER 1001

EXPOSE 8080