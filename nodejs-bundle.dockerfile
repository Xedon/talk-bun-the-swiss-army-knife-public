FROM node:18-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY nestjs .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN npx esbuild@0.19.10 src/main.ts \
    --bundle --platform=node --minify --outfile=dist/esbuild-nestjs \
    --external:class-transformer \
    --external:class-validator \
    --external:@nestjs/microservices \
    --external:@nestjs/websockets/socket-module

FROM gcr.io/distroless/nodejs18-debian12:nonroot

WORKDIR /app

COPY --from=build /app/dist/esbuild-nestjs dist/esbuild-nestjs

EXPOSE 3000

# Start the NestJS application
CMD [ "/app/dist/esbuild-nestjs" ]
