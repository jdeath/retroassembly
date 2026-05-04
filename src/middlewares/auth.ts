import { createMiddleware } from 'hono/factory'
import { defaultRedirectTo } from '#@/constants/auth.ts'
import { getRunTimeEnv, stripBasePath } from '#@/constants/env.ts'

export function auth() {
  return createMiddleware(async function middleware(c, next) {
    const { currentUser } = c.var

    const { origin, pathname: rawPathname, search } = new URL(c.req.raw.url)
    const pathname = stripBasePath(rawPathname)
    const needAuth = ['/library', '/library.data'].includes(pathname) || pathname.startsWith('/library/')
    if (!needAuth || currentUser) {
      await next()
      return
    }

    const appPath = `${pathname}${search}`
    const basePath = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_BASE_PATH || ''
    const loginUrl = new URL(`${basePath}/login`, origin)
    if (appPath !== defaultRedirectTo) {
      loginUrl.searchParams.set('redirect_to', `${basePath}${appPath}`)
    }
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`

    return c.redirect(loginUrlPath)
  })
}
