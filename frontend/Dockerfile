# React site: built once with Vite, then served as static files by nginx.
# Railway builds this with Root Directory = frontend/.

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The API address is baked into the JavaScript bundle at build time - there is no
# server-side configuration at runtime. Changing it means rebuilding/redeploying.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN test -n "$VITE_API_BASE_URL" || (echo "ERROR: VITE_API_BASE_URL build arg is required (e.g. https://<backend-domain>/api/v1)" >&2 && exit 1)
RUN npm run build


FROM nginx:1.27-alpine
# The official image renders *.template files with the container's environment
# variables at start, which is how nginx learns Railway's $PORT.
ENV PORT=8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
