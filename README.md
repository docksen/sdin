# sdin

> Sdin /s'dɪn/ means Small Dinosaur.  
> 折梅逢驿使，寄与陇头人。江南无所有，聊赠一枝春。

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

<table>
  <tbody>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/en.md">English 英语 Inglés</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/zh.md">Chinese 汉语 Chino</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/hi.md">Hindi 印地语 हिंदी</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/spa.md">Spanish 西语 Español</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/fr.md">French 法语 Français</a></td>
    </tr>
    --
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ar.md">Arabic 阿语 عربي</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/bn.md">Bengali 孟加拉语 বাঙালি</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ru.md">Russian 俄语 Русский</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/pt.md">Portuguese 葡语 Português</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/id.md">Indonesian 印尼语 Indonesia</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ur.md">Urdu 乌尔都语 اردو</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/de.md">German 德语 Deutsch</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ja.md">Japanese 日语 日本語</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/sw.md">Swahili 斯瓦希里语 Kiswahili</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/tr.md">Turkish 土耳其语 Türkçe</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ta.md">Tamil 泰米尔语 தமிழ்</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ko.md">Korean 韩语 한국인</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/vi.md">Vietnamese 越南语 Việt Nam</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/it.md">Italian 意大利语 Italiana</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/th.md">Thai 泰语 แบบไทย</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/fa.md">Persian 波斯语 فارسی</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/uk.md">Ukrainian 乌克兰语 Український</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/fil.md">Filipino 菲律宾语 Pilipino</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/he.md">Hebrew 希伯来语 עִברִית</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/el.md">Greek 希腊语 ελληνικά</a></td>
    </tr>
  </tbody>
</table>

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
