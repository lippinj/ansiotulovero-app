FROM node:20-alpine AS build
WORKDIR /app

# Copy workspace configuration
COPY package.json package-lock.json ./

# Copy package configurations
COPY packages/base/package.json ./packages/base/
COPY packages/app/package.json ./packages/app/

# Install all dependencies
RUN npm ci

# Copy source code
COPY packages/ ./packages/

# Build base package first
RUN npm run build --workspace=base

# Set build environment
ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# Build app package
RUN npm run build --workspace=app

FROM nginx:stable-alpine
# Copy built app from correct location
COPY --from=build /app/packages/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Use the same base path for nginx as was used for the build
ARG VITE_BASE_PATH=/
ENV BASE_PATH=$VITE_BASE_PATH
RUN envsubst '${BASE_PATH}' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf && \
    mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
