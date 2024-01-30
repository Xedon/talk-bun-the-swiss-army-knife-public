FROM oven/bun:1 as build

WORKDIR /app

COPY nestjs/package.json nestjs/bun.lockb ./

RUN bun i --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY nestjs .

RUN bun build src/main.ts \
    --minify --target node --outfile=nestjs \
    --external class-transformer \
    --external class-validator \
    --external @nestjs/microservices \
    --external @nestjs/websockets/socket-module

FROM oven/bun:1-distroless

WORKDIR /app

COPY --from=build /app/nestjs .

EXPOSE 3000

CMD [ "/app/nestjs" ]
