# Docker Setup — Frontend App

> เมื่อถูกขอให้สร้าง Dockerfile หรือ Docker config ให้ generate ไฟล์ต่อไปนี้ทันที และห้ามแสดงแค่ตัวอย่าง — ต้อง output code จริงเสมอ

---

## Prompt: Generate Dockerfile สำหรับ Frontend App

```
สร้าง Dockerfile แบบ multi-stage build สำหรับ frontend app (Vite + React/Next.js) โดยมีเงื่อนไขดังนี้:

1. Stage 1 — builder
   - Base image: node:20-alpine
   - Package manager: pnpm (ใช้ corepack enable)
   - Copy package.json + lockfile ก่อน แล้วค่อย install (layer caching)
   - รับ build args: VITE_API_BASE_URL, VITE_APP_ENV
   - รัน pnpm build

2. Stage 2 — runner (production)
   - Base image: nginx:alpine
   - Copy dist/ จาก builder ไปที่ /usr/share/nginx/html
   - Copy nginx.conf custom (single-page app — fallback to index.html)
   - Expose port 80
   - CMD ["nginx", "-g", "daemon off;"]

3. ข้อกำหนด:
   - ใช้ .dockerignore เพื่อ exclude node_modules, .git, coverage, dist
   - ใส่ LABEL maintainer และ version
   - Image ขั้นสุดท้ายต้องไม่มี dev dependencies

4. ไฟล์ที่ต้อง generate:
   - Dockerfile
   - nginx.conf
   - .dockerignore
   - docker-compose.yml (dev + prod service)
   - scripts/docker-build.sh (build + tag + optional push)
```

---

## ไฟล์ที่ต้อง Generate

### `Dockerfile`

```dockerfile
# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

LABEL maintainer="[TEAM_NAME]" \
      version="1.0.0"

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Layer cache: install deps first
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build args for env injection
ARG VITE_API_BASE_URL=http://localhost:3000
ARG VITE_APP_ENV=production
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_APP_ENV=$VITE_APP_ENV

COPY . .
RUN pnpm build

# ─── Stage 2: Runner ─────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

### `nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable caching for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1024;
}
```

---

### `.dockerignore`

```
node_modules
dist
.git
.gitignore
coverage
*.log
.env
.env.*
!.env.example
.DS_Store
Thumbs.db
```

---

### `docker-compose.yml`

```yaml
version: "3.9"

services:
  # ── Development (hot-reload via Vite dev server) ──────────────────────────
  app-dev:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "corepack enable && pnpm install && pnpm dev --host"
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:3000}
      - VITE_APP_ENV=development
    profiles: [dev]

  # ── Production (nginx serving built dist) ────────────────────────────────
  app-prod:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:3000}
        VITE_APP_ENV: production
    ports:
      - "80:80"
    restart: unless-stopped
    profiles: [prod]
```

---

### `scripts/docker-build.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-[PROJECT_NAME]-frontend}"
TAG="${TAG:-latest}"
REGISTRY="${REGISTRY:-}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:3000}"
VITE_APP_ENV="${VITE_APP_ENV:-production}"

FULL_IMAGE="${REGISTRY:+${REGISTRY}/}${IMAGE_NAME}:${TAG}"

echo "Building: ${FULL_IMAGE}"

docker build \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  --build-arg VITE_APP_ENV="${VITE_APP_ENV}" \
  -t "${FULL_IMAGE}" \
  .

echo "Build complete: ${FULL_IMAGE}"

# Push only when PUSH=true is set
if [[ "${PUSH:-false}" == "true" ]]; then
  echo "Pushing: ${FULL_IMAGE}"
  docker push "${FULL_IMAGE}"
fi
```

---

## Docker Commands

```bash
# Development (hot-reload)
docker compose --profile dev up

# Production build & run
docker compose --profile prod up --build

# Build image only (manual)
bash scripts/docker-build.sh

# Build with custom tag & push
IMAGE_NAME=my-app TAG=v1.0.0 REGISTRY=ghcr.io/myorg PUSH=true bash scripts/docker-build.sh

# Inspect final image size
docker image ls [PROJECT_NAME]-frontend

# Shell into running container
docker exec -it <container_id> sh
```

---

## Folder Structure (Docker files)

```
[PROJECT_NAME]/
├── Dockerfile
├── nginx.conf
├── .dockerignore
├── docker-compose.yml
└── scripts/
    └── docker-build.sh
```

---

## Quick Start (Docker)

```bash
pnpm docker:dev      # docker compose --profile dev up
pnpm docker:build    # docker compose --profile prod build
pnpm docker:prod     # docker compose --profile prod up
```

เพิ่ม scripts ใน `package.json`:

```json
{
  "scripts": {
    "docker:dev":   "docker compose --profile dev up",
    "docker:build": "docker compose --profile prod build",
    "docker:prod":  "docker compose --profile prod up"
  }
}
```

---

## Best Practices

| Rule | Why |
|------|-----|
| Multi-stage build | ลด image size — runner ไม่มี node_modules หรือ source code |
| pnpm --frozen-lockfile | ป้องกัน dependency drift ใน CI/CD |
| Build args สำหรับ env vars | ไม่ bake secrets ลง image — ส่ง args ตอน build เท่านั้น |
| .dockerignore | ลด build context — ทำให้ build เร็วขึ้น |
| nginx SPA fallback | React Router / client-side routing ทำงานได้ถูกต้อง |
| Cache-Control headers | Assets ถูก cache, index.html ไม่ถูก cache — deploy ใหม่ได้ทันที |
