import { getContext } from 'hono/context-storage'
import { defaultRedirectTo } from '#@/constants/auth.ts'
import { getRunTimeEnv } from '#@/constants/env.ts'
import { countUsers } from '#@/controllers/users/count-users.ts'
import { LoginPage } from '../login/page.tsx'
import type { Route } from './+types/login.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const { currentUser, supabase, t } = c.var
  const { searchParams } = new URL(request.url)
  const basePath = getRunTimeEnv().RETROASSEMBLY_RUN_TIME_BASE_PATH || ''
  // redirect_to from the auth middleware already contains the full path (basePath included).
  // Fall back to basePath + defaultRedirectTo when navigating directly to /login.
  const redirectTo = searchParams.get('redirect_to') ?? `${basePath}${defaultRedirectTo}`

  if (currentUser) {
    throw c.redirect(redirectTo)
  }

  if (supabase) {
    const formType = 'oauth'
    const code = searchParams.get('code')
    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          return { error, formType, redirectTo, title: t('auth.login') }
        }
      } catch (error: any) {
        return { error, formType, redirectTo, title: t('auth.login') }
      }

      throw c.redirect(redirectTo)
    }

    return { formType, redirectTo, title: t('auth.login') }
  }

  const userCount = await countUsers()
  const formType = userCount ? 'login' : 'register'
  return { formType, redirectTo, title: t('auth.login') }
}

export default function LoginRoute() {
  return <LoginPage />
}
