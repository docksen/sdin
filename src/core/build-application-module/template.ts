import { SdinApplicationPage } from 'configs/application-page'
import { relativePosix } from 'utils/path'

export function getHtmlString(page: SdinApplicationPage) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    ${page.getMetaHtmlString()}
    <title>${page.getHtmlTitle()}</title>
    <script>window.datas=${JSON.stringify(page.getHtmlDatas())}</script>
    ${page.getLinkHtmlString()}
    ${page.getScriptHtmlString()}
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
