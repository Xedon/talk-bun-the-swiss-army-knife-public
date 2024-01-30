---
marp: true
footer: "![image h:50](slideAssets/bun.png) ![image h:50](slideAssets/mayflower_logo_weiß.png)"
style: |
  h1,h2,h3 {
    color: #e35205;
  }
  section {
    color: #707372;
  }
  footer {
    width: 95%;
    display: flex;
    justify-content: space-between;
  }
---

# Bun das JS/TS 'Schweizer Taschenmesser'

<!--
Slides Öffnen
Presenter view Öffnen
VsCode hinter präsi auf dem selben screen Öffnen
+1 vscode zoom
-->

---

## Bun

**Designed von Jarred Sumner
als Drop-In replacement für Node.Js**

Geschrieben in _ZIG_
Benutzt JavaScriptCore
Erstes Release Feb 2021
1.0 Release Sep 2023

<!--
Designed von Jarred Sumner
als Drop-In replacement für Node.Js
 _ZIG_
JavaScriptCore nicht V8
Erstes Release Feb 2021
1.0 Release Sep 2023
-->

---

## Bun als Packetmanager `bun install`

- npm kompatibel
- Workspace Support
  - dependency sharing
- Keine install script Ausführung peer default
- Binäres Lockfile

---

## Live Demo

---

## Bun als Runtime `bun run`

### Plug and Play

- Node.Js Packete mit kleinen Ausnahmen
- Node.Js Node-Api Packete
- Npm Packete

---

## Live Demo

---

### Developer experience

- Einfache Funktionen `Bun.`
- Typescript direkt ausfühbar
- JSX direkt verwendbar
- CommonJs & ESM kein unterschied
- Watchmode & Hotreload
- FFI (foreign function interface) in JS/TS

---

### Performance

- Schneller start
- Etwas mehr Speicherverbrauch
- Geringere JS Performance
- Schnellere native Aufrufe
- Schnelleres FFI (foreign function interface)

  ... als Node.Js

---

### Nestjs By example

NodeJS:

- RPS: min 4120, max 6030, median 5356
- RT: min 105ms, max 176ms, median 119ms

Bun:

- RPS: min 8830, max 17400, median 14188
- RT: min 58ms, max 174ms, median 94ms

Bun kann fast das dreifache an Requests pro sekunde handeln bei besserer latenz

---

### In der Realität

![realworld](slideAssets/realworld.png)
Source: <https://medium.com/deno-the-complete-reference/is-bun-really-much-faster-than-node-js-e5b15942a8e8>

---

### Als Container Image

| Build         | Image | Basis Image | Applikation |
| ------------- | ----- | ----------- | ----------- |
| bun           | 119MB | 109MB       | 10MB        |
| nodejs        | 176MB | 167MB       | 10MB        |
| nodejs-bundle | 168MB | 167MB       | 1 MB        |
| bun-bundle    | 111MB | 109MB       | 2 MB        |
| sf-bun        | 111MB | 15.1MB      | 95,9MB      |

---

## Bun als Transpiler und Bundler `bun build`

- Etwas Schneller als esbuild!
- Support für:
  - JSX
  - TS
  - Single Binary
- Transpiler Makro Support

---

## Live Demo

---

## Bun als Test-Framework `bun test`

- Schnellster Test-Runner
- Drop-In replacement für Jest
- Mock/Spy/Coverage on board

---

## Live Demo

---

## Bun Specials

- Direkte Typescript Ausführung
- Single Binary
- Hotreload
- FFI (foreign function interface) in JS/TS
- Alles in einem Tool

---

## Danke für eure Aufmerksamkeit

## Slides und Beispiele auf Github auf meinem Profile _xedon_ angepinnt

## ![bg right h:500](slideAssets/qr-code.png)
