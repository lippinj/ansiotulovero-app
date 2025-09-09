FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use the same base path for nginx as was used for the build
ARG VITE_BASE_PATH=/
ENV BASE_PATH=$VITE_BASE_PATH
RUN envsubst '${BASE_PATH}' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf && \
    mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
