import '../utils/server/migration/initalization.ts'
import '../utils/server/migration/raw-metadata.ts'
import { serveStatic } from '@hono/node-server/serve-static'
import { handler } from 'hono-react-router-adapter/node'
import { Hono } from 'hono'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we can not guarantee that this file exists
import * as build from '../../dist/server/index.js'
import serverApp from './app.ts'

const basePath = process.env.RETROASSEMBLY_RUN_TIME_BASE_PATH || ''
const pages = handler({ ...build, basename: basePath || '/' })

serverApp.route('', pages)

// Wrap in a root-level app so that static assets (/_assets/, /favicon.ico, etc.)
// are served without requiring the base-path prefix, allowing nginx to proxy all
// traffic to this server while the app still mounts under basePath.
const rootApp = new Hono()
rootApp.use(
  serveStatic({
    onFound: (_path, c) => {
      c.header('Cache-Control', 'public, immutable, max-age=31536000')
    },
    precompressed: true,
    root: 'dist/client',
  }),
)
rootApp.route('', serverApp)

export default rootApp
