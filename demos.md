---
cwd: nestjs
runme:
  id: 01HJS4EAEA9N1QEW6CD88S03R4
  version: v2.2
---

## npm install vs pnpm install vs bun install

### npm

```sh {"background":"false","id":"01HJS4FNPT06580R5DV7X62ZC3","interactive":"false"}
rm -rf node_modules
```

```sh {"id":"01HJS5PK8Y11ZEN6Q5NPT01406"}
npm install --offline
```

### pnpm

```sh {"background":"false","id":"01HJS4FNPT06580R5DV7X62ZC3","interactive":"false"}
rm -rf node_modules
```

```sh {"id":"01HJS4GTQ9T93BCHPMFXHGBKE0"}
pnpm install --prefer-offline
```

### bun

```sh {"background":"false","id":"01HJS4HTP5FZM181Z6VA15HFCH","interactive":"false"}
rm -rf node_modules
```

```sh {"id":"01HJS4J83Z9SYXXSE1M8T93NJF"}
bun install --offline
```

## Node.Js VS Bun Runtime

```sh {"id":"01HJTQGR2X30XETTX4MJ3FMRW1","terminalRows":"16"}
npx cowsay@1.5.0 -f cat2 "Hallo, FrankenJs!"
```

```sh {"id":"01HJTQTEJW3JFZTGCT6KMSC8TR","terminalRows":"16"}
bunx cowsay@1.5.0 -f cat2 "Hallo, FrankenJs!"
```

## vite vs esbuild vs bun build

### vite build

```sh {"id":"01HJTRMQA7GHR2TD892640WXFV"}
time pnpm build
```

### Esbuild

```sh {"id":"01HJTRXS4X78DWPQJSSTXJY2AD"}
npx --offline esbuild@0.19.10 src/main.ts \
    --bundle --platform=node --minify --outfile=dist/esbuild-nestjs \
    --external:class-transformer \
    --external:class-validator \
    --external:@nestjs/microservices \
    --external:@nestjs/websockets/socket-module

du -bh dist/esbuild-nestjs
```

### Bun Build

```sh {"id":"01HJTRKM4HRGA2G0ZG3J54YKZ3"}
time bun build src/main.ts \
    --target node --minify --outfile=dist/bun-nestjs \
    --external class-transformer \
    --external class-validator \
    --external @nestjs/microservices \
    --external @nestjs/websockets/socket-module
du -bh dist/bun-nestjs
```

### Bun Build - Single Binary

```sh {"id":"01HJTRJT1DD2FXMGAQ517MY0KQ"}
time bun build src/main.ts \
    --compile --minify --outfile=dist/bun-sf-nestjs \
    --external class-transformer \
    --external class-validator \
    --external @nestjs/microservices \
    --external @nestjs/websockets/socket-module
du -bh dist/bun-sf-nestjs
```

### Bun Makro Support

```sh {"id":"01HJV5PSH879Z1KNDH6S1WQXBE","mimeType":"text/x-javascript"}
cat ../bun-examples/makroLib.ts
cat ../bun-examples/makro.ts
```

```sh {"id":"01HJV61DJM1BK1TJ7Q1RHQ1XN5","mimeType":"text/x-javascript"}
bun build ../bun-examples/makro.ts
```

## Bun test

### Nestjs example

```sh {"id":"01HJV4CNN89PD5H7DM2D5EM41J","mimeType":"text/x-javascript"}
cat src/app.controller.spec.ts
```

### Jest

```sh {"id":"01HJV52JNNV1MGSXF2Y1SM664G"}
pnpm exec jest src/app.controller.spec.ts
```

### Bun

```sh {"id":"01HJV542ZWXAFFE7HJSKY4GRVG"}
bun test src/app.controller.spec.ts
```
