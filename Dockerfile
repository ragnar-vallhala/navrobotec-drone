# ---------------------------------------------------------------------------
# The VaiOS site (navrobotec.in).
#
# Unlike the services site this cannot be a static build: app/api/send is a
# server route that sends mail, so the image runs a real Node process.
#
# `prebuild` runs scripts/convert-docs.mjs, which wants pandoc, LaTeX and
# dvisvgm to regenerate the docs from the LaTeX source. Those are not
# installed here — a TeX distribution is larger than everything else in this
# image put together — and the script exits cleanly without them, using the
# committed content/docs. The consequence, stated plainly: the docs in a built
# image are as fresh as the last commit that ran the converter, which is what
# the docs.yml workflow is for.
# ---------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
# Pinned to the npm the lock file was written by; node:22-alpine ships npm 10,
# which refuses a lock file npm 11 produced. Bump this and the lock together.
RUN npm install -g npm@11.6.2
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL="https://navrobotec.in"
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 10001 -S nextjs && adduser -u 10001 -S nextjs -G nextjs

COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
