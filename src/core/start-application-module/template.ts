import { SdinApplicationPage } from 'configs/application-page'
import { getDependenceVersion } from 'utils/npm'
import { relativePosix } from 'utils/path'

export function getHtmlString(page: SdinApplicationPage) {
  const devEmoji = page.parent.devEmoji
  const scripts = page.scripts.filter(item => {
    return !getDependenceVersion(page.parent.pkg, item.key)
  })
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    ${page.getMetaHtmlString()}
    <title>${devEmoji ? devEmoji + ' ' : ''}${page.getHtmlTitle()}</title>
    <script>window.datas=${JSON.stringify(page.getHtmlDatas())}</script>
    ${page.getLinkHtmlString()}
    ${page.getScriptHtmlString(scripts)}
    ${page.getStyleHtmlString()}
  </head>
  <body>
    <div id="app">
      ${page.getSkeleton()}
    </div>
  </body>
</html>`
}

export function getScriptString(page: SdinApplicationPage, index: string) {
  return `import React from 'react'
import { createRoot } from 'react-dom/client'
import Entry from ${JSON.stringify(relativePosix(index, page.index))}

const root = createRoot(document.getElementById('app'))
root.render(<Entry />)`
}
