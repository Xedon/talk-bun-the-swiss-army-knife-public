FROM oven/bun:1 as build

WORKDIR /app

COPY nestjs/package.json nestjs/bun.lockb ./

RUN bun i --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY nestjs .

RUN bun run build 

RUN rm -rf node_modules && bun i --production --frozen-lockfile

FROM oven/bun:1-distroless

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000


# Start the NestJS application
CMD [ "run","dist/main.js" ]
