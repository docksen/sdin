# sdin

> Sdin /s'dɪn/ means Small Dinosaur.

This is a JavaScript package builder, which uses Webpack and Gulp for packaging internally, and has the following features:

1. Supports compression and obfuscation of code.
2. Supports global definition.
3. Supports path aliases.
4. Supports custom generation of multiple modules.
5. Can be packaged into ESM, CJS, UMD modules.
6. Can generate "multi-file" products and "single-file" products.
7. Supports reference text, fonts, images, audio, video.
8. Supports React, JSX, SCSS, CSS.
9. Supports TypeScript and JavaScript.
10. Use TypeScript as the language of the configuration file.

## Documents

If you want to use it, please read the user manual:

- [中文](https://github.com/docksen/sdin/blob/main/pro/documents/zh.md)
- [English](https://github.com/docksen/sdin/blob/main/pro/documents/en.md)

## Examples

Build project in command line:

```shell
$ sdin build
i Project hello, version 0.0.1.
i Project files are qualified, checking took 0.003 s.
√ Successfully built foundation cjs module camille, it took 0.32 s.
√ Successfully built foundation esm module elise, it took 0.06 s.
√ Successfully built declaration dts module diana, it took 1.361 s.
√ Successfully built integration umd module urgoth, it took 12.173 s.
i Webpack compiled information:
  asset demo.0d177d92e9.png 60 KiB [emitted] [immutable] ...
  asset index.js 13.1 KiB [emitted] [minimized] ...
  asset index.css 272 bytes [emitted] [minimized] ...
  ...
```

Build project in script:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const config = await readSdinConfig({ root: 'path/to/project' })
  await buildSdinProject({ config })
}
```

## Postscript

The version of the package dependent on this package has been solidified. No version will be released unless necessary to ensure the correctness of the program.

This package will maintain the v1 version for a long time. The interface field name, type and its meaning will not change. Please feel free to use it.
