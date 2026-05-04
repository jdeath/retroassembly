import { AlertDialog, Button } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { metadata } from '#@/constants/metadata.ts'

export function LogoutDialog(props: Readonly<AlertDialog.RootProps>) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function handleClickLogout() {
    navigate('/logout')
  }

  return (
    <AlertDialog.Root {...props}>
      <AlertDialog.Content>
        <AlertDialog.Title className='flex items-center gap-2'>
          <span className='icon-[mdi--hand-wave]' />
          {t('dialog.logoutConfirmTitle', { title: metadata.title })}
        </AlertDialog.Title>

        <AlertDialog.Description>{t('auth.canAlwaysLogBackIn')}</AlertDialog.Description>

        <div className='mt-4 flex justify-end gap-4'>
          <AlertDialog.Cancel>
            <Button>
              <span className='icon-[mdi--close]' />
              {t('common.cancel')}
            </Button>
          </AlertDialog.Cancel>
          <Button onClick={handleClickLogout} variant='soft'>
            <span className='icon-[mdi--logout]' />
            {t('auth.logout')}
          </Button>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
