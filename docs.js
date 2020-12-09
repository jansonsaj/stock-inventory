
import Koa from 'koa'
import serve from 'koa-static'

const app = new Koa()

const defaultDocsPort = 3030
const docsPort = process.env.DOCS_PORT || defaultDocsPort

app.use(serve('docs/jsdoc'))

app.listen(docsPort, () => console.log(`JSDocs are available on port ${docsPort}`))
