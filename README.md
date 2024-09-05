# sdin

> Sdin /s'dɪn/ means Small Dinosaur.  
> 折梅逢驿使，寄与陇头人。江南无所有，聊赠一枝春。

This is a JavaScript package builder, which uses Webpack and Gulp for packaging internally, and has the following features:

<table style="font-size:12px">
  <tbody>
    <tr>
      <td>🐁 Supports compression and obfuscation of code.</td>
      <td>🐃 Supports global definition.</td>
    </tr>
    <tr>
      <td>🐅 Supports path aliases.</td>
      <td>🐇 Supports custom generation of multiple modules.</td>
    </tr>
    <tr>
      <td>🐉 Can be packaged into ESM, CJS, UMD modules.</td>
      <td>🐍 Can generate "multi-file" products and "single-file" products.</td>
    </tr>
    <tr>
      <td>🐎 Supports reference text, fonts, images, audio, video.</td>
      <td>🐐 Supports React, JSX, SCSS, CSS.</td>
    </tr>
    <tr>
      <td>🐒 Supports TypeScript and JavaScript.</td>
      <td>🐓 Use TypeScript as the language of the configuration file.</td>
    </tr>
  </tbody>
</table>

## Documents

If you want to use it, please read the user manual:

<table style="font-size:12px">
  <tbody>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/zh.md">Chinese 汉语 漢語</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/en.md">English 英语 English</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/spa.md">Spanish 西班牙语 Español</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ara.md">Arabic 阿拉伯语 العربية</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/pt.md">Portuguese 葡萄牙语 Português</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/ru.md">Russian 俄语 русский язык</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/jp.md">Japanese 日语 日本語</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/de.md">German 德语 Deutsch</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/vie.md">Vietnamese 越南语 Tiếng Việt</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/kor.md">Korean 韩语 한국어</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/fra.md">French 法语 Français</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/th.md">Thai 泰语 ภาษาไทย</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/it.md">Italian 意大利语 Italiano</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/pl.md">Polish 波兰语 język polski</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/rom.md">Romanian 罗马尼亚语 română</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/nl.md">Dutch 荷兰语 Nederlands</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/hu.md">Hungarian 匈牙利语 magyar</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/el.md">Greek 希腊语 Ελληνικά</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/cs.md">Czech 捷克语 Čeština</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/swe.md">Swedish 瑞典语 Svenska</a></td>
    </tr>
    <tr>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/bul.md">Bulgarian 保加利亚语 български</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/dan.md">Danish 丹麦语 Dansk</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/fin.md">Finnish 芬兰语 suomi</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/slo.md">Slovenian 斯洛文尼亚语 Slovenščina</a></td>
      <td><a target="_blank" href="https://github.com/docksen/sdin/blob/main/pro/documents/est.md">Estonian 爱沙尼亚语 eesti keel</a></td>
    </tr>
  </tbody>
</table>

## Examples

Create project:

```shell
sdin create
```

Build project in command line:

```shell
sdin build
```

Build project in script:

```typescript
import { readSdinConfig, buildSdinProject } from 'sdin'
async function main() {
  const root = process.cwd()
  const config = await readSdinConfig({ root })
  await buildSdinProject({ config })
}
```

## Postscript

The version of the package dependent on this package has been solidified. No version will be released unless necessary to ensure the correctness of the program.

This package will maintain the v1 version for a long time. The interface field name, type and its meaning will not change. Please feel free to use it.

If the content of the user manual is incorrect, please help me correct it, thank you.
