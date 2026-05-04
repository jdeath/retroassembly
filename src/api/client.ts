import { attemptAsync, isBrowser } from 'es-toolkit'
import { hc, parseResponse } from 'hono/client'
import type { AppType } from './app'

function getBaseUrl() {
  if (!isBrowser()) {
    return `http://localhost${process.env.RETROASSEMBLY_RUN_TIME_BASE_PATH || ''}`
  }
  // React Router injects __reactRouterContext before module scripts run during SSR hydration.
  // The basename it contains is exactly the value we overrode in node.ts at startup.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const basename = (window as any).__reactRouterContext?.basename ?? ''
  const basePath = basename === '/' ? '' : basename.replace(/\/$/, '')
  return `${location.origin}${basePath}`
}

const baseUrl = getBaseUrl()

export const client = hc<AppType>(baseUrl, {
  async fetch(...args: Parameters<typeof fetch>) {
    const response = await fetch(...args)
    if (response.ok) {
      return response
    }
    const [, json] = await attemptAsync(() => response.json())
    throw json ?? response
  },
}).api.v1
export type { InferRequestType, InferResponseType } from 'hono'
export { parseResponse }
