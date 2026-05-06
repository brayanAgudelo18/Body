import type { MemberAccount } from '../lib/types'
import { readJson } from '../lib/storage'

const LS_ACCOUNTS = 'bhg_accounts_v1'

export function readPublicMembers() {
  const accounts = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
  return accounts
    .filter((a) => (a.role ?? 'member') === 'member')
    .filter((a) => a.profile?.showInCommunity)
    .map((a) => ({
      id: a.id,
      fullName: a.fullName,
      goal: a.profile?.goal ?? '',
      about: a.profile?.about ?? '',
      photoDataUrl: a.profile?.visibility?.photo ? a.profile?.photoDataUrl ?? '' : '',
      phone: a.profile?.visibility?.phone ? a.profile?.phone ?? '' : '',
      social: a.profile?.visibility?.social ? a.profile?.social ?? '' : '',
      optionalInfo: a.profile?.visibility?.optionalInfo ? a.profile?.optionalInfo ?? '' : '',
    }))
}

