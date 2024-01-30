FROM oven/bun:1 as build

WORKDIR /app

COPY nestjs/package.json nestjs/bun.lockb ./

RUN bun i --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY nestjs .

RUN bun build src/main.ts \
    --compile --minify --outfile=nestjs \
    --external class-transformer \
    --external class-validator \
    --external @nestjs/microservices \
    --external @nestjs/websockets/socket-module

FROM gcr.io/distroless/base-nossl-debian11:nonroot

WORKDIR /app

COPY --from=build /app/nestjs .

EXPOSE 3000

ENTRYPOINT [ "/app/nestjs" ]
