# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

LABEL maintainer="U-Next Team" \
      version="1.0.0" \
      description="U-Next University Management System — Angular 19 frontend"

WORKDIR /app

# Layer cache: install dependencies before copying source
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source and build for production
COPY . .
RUN npm run build -- --configuration production

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built Angular app (browser sub-folder from Angular 18+)
COPY --from=builder /app/dist/unext-front-end/browser /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
