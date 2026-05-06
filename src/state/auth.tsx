import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { MEMBERSHIP_PLANS } from '../lib/data'
import type { MemberAccount } from '../lib/types'
import { addDaysIso, nowIso, readJson, writeJson } from '../lib/storage'

type AuthState = {
  member: Omit<MemberAccount, 'password'> | null
  isReady: boolean
  isAdmin: boolean
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
  payMonthly: () => { ok: true; newExpiresAtIso: string } | { ok: false; error: string }
  updateCommunityProfile: (payload: {
    showInCommunity: boolean
    about?: string
    goal?: string
    photoDataUrl?: string
    phone?: string
    social?: string
    optionalInfo?: string
    visibility?: {
      photo: boolean
      phone: boolean
      social: boolean
      optionalInfo: boolean
    }
  }) => { ok: true } | { ok: false; error: string }
}

const LS_ACCOUNTS = 'bhg_accounts_v1'
const LS_SESSION = 'bhg_session_v1'

const AuthCtx = createContext<AuthState | null>(null)

function seedAccountsIfEmpty() {
  const existing = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
  if (existing.length) return

  const today = nowIso()
  const plan = MEMBERSHIP_PLANS.mensual
  const seeded: MemberAccount[] = [
    {
      id: 'a_admin',
      fullName: 'Administrador',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      profile: { showInCommunity: false, about: 'Administrador del gimnasio.' },
      membership: {
        planId: 'mensual',
        expiresAtIso: addDaysIso(today, 3650),
        lastPaymentAtIso: today,
      },
    },
    {
      id: 'm_ana',
      fullName: 'Ana García',
      username: 'ana',
      password: '1234',
      role: 'member',
      profile: {
        showInCommunity: true,
        about: 'Entreno fuerza 4 veces por semana.',
        goal: 'Aumentar masa muscular',
        phone: '',
        social: '',
        optionalInfo: '',
        visibility: { photo: true, phone: false, social: false, optionalInfo: false },
      },
      membership: {
        planId: 'mensual',
        expiresAtIso: addDaysIso(today, 12),
        lastPaymentAtIso: addDaysIso(today, -18),
      },
    },
    {
      id: 'm_brayan',
      fullName: 'Brayan',
      username: 'brayan',
      password: '1234',
      role: 'member',
      profile: {
        showInCommunity: false,
        about: 'Enfocado en constancia y movilidad.',
        goal: 'Bajar grasa',
        phone: '',
        social: '',
        optionalInfo: '',
        visibility: { photo: true, phone: false, social: false, optionalInfo: false },
      },
      membership: {
        planId: 'mensual',
        expiresAtIso: addDaysIso(today, 3),
        lastPaymentAtIso: addDaysIso(today, -27),
      },
    },
    {
      id: 'm_demo',
      fullName: 'Miembro Demo',
      username: 'demo',
      password: 'demo',
      role: 'member',
      profile: {
        showInCommunity: true,
        about: 'Me gusta mezclar pesas y cardio.',
        goal: 'Recomposición corporal',
        phone: '',
        social: '',
        optionalInfo: '',
        visibility: { photo: true, phone: false, social: false, optionalInfo: false },
      },
      membership: {
        planId: 'mensual',
        expiresAtIso: addDaysIso(today, plan.days),
        lastPaymentAtIso: today,
      },
    },
  ]

  writeJson(LS_ACCOUNTS, seeded)
}

function stripPassword(a: MemberAccount): Omit<MemberAccount, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = a
  return rest
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [member, setMember] = useState<Omit<MemberAccount, 'password'> | null>(null)

  useEffect(() => {
    seedAccountsIfEmpty()
    const accounts = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
    const normalized = accounts.map((a) => ({
      ...a,
      role: a.role ?? 'member',
      profile: {
        showInCommunity: a.profile?.showInCommunity ?? false,
        about: a.profile?.about ?? '',
        goal: a.profile?.goal ?? '',
        photoDataUrl: a.profile?.photoDataUrl ?? '',
        phone: a.profile?.phone ?? '',
        social: a.profile?.social ?? '',
        optionalInfo: a.profile?.optionalInfo ?? '',
        visibility: {
          photo: a.profile?.visibility?.photo ?? true,
          phone: a.profile?.visibility?.phone ?? false,
          social: a.profile?.visibility?.social ?? false,
          optionalInfo: a.profile?.visibility?.optionalInfo ?? false,
        },
      },
    }))
    if (JSON.stringify(accounts) !== JSON.stringify(normalized)) writeJson(LS_ACCOUNTS, normalized)

    const session = readJson<{ memberId: string } | null>(LS_SESSION, null)
    if (session?.memberId) {
      const found = normalized.find((a) => a.id === session.memberId)
      if (found) setMember(stripPassword(found))
    }
    setIsReady(true)
  }, [])

  const value = useMemo<AuthState>(() => {
    return {
      member,
      isReady,
      isAdmin: !!member && (member.role ?? 'member') === 'admin',
      login: (username, password) => {
        const accounts = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
        const found = accounts.find((a) => a.username === username)
        if (!found) return { ok: false, error: 'Usuario no encontrado.' }
        if (found.password !== password) return { ok: false, error: 'Contraseña incorrecta.' }
        writeJson(LS_SESSION, { memberId: found.id })
        setMember(stripPassword(found))
        return { ok: true }
      },
      logout: () => {
        localStorage.removeItem(LS_SESSION)
        setMember(null)
      },
      payMonthly: () => {
        if (!member) return { ok: false, error: 'Necesitas iniciar sesión.' }
        if ((member.role ?? 'member') === 'admin') return { ok: false, error: 'Admin no requiere mensualidad.' }

        const accounts = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
        const idx = accounts.findIndex((a) => a.id === member.id)
        if (idx === -1) return { ok: false, error: 'Cuenta no encontrada.' }

        const plan = MEMBERSHIP_PLANS[accounts[idx].membership.planId]
        const now = nowIso()

        const currentExpiry = new Date(accounts[idx].membership.expiresAtIso).getTime()
        const baseIso = currentExpiry > Date.now() ? accounts[idx].membership.expiresAtIso : now
        const newExpiresAtIso = addDaysIso(baseIso, plan.days)

        accounts[idx] = {
          ...accounts[idx],
          membership: {
            ...accounts[idx].membership,
            expiresAtIso: newExpiresAtIso,
            lastPaymentAtIso: now,
          },
        }
        writeJson(LS_ACCOUNTS, accounts)
        setMember(stripPassword(accounts[idx]))
        return { ok: true, newExpiresAtIso }
      },
      updateCommunityProfile: (payload) => {
        if (!member) return { ok: false, error: 'Necesitas iniciar sesión.' }
        if ((member.role ?? 'member') === 'admin') return { ok: false, error: 'Admin no aplica en comunidad.' }
        const accounts = readJson<MemberAccount[]>(LS_ACCOUNTS, [])
        const idx = accounts.findIndex((a) => a.id === member.id)
        if (idx === -1) return { ok: false, error: 'Cuenta no encontrada.' }
        accounts[idx] = {
          ...accounts[idx],
          profile: {
            showInCommunity: payload.showInCommunity,
            about: payload.about ?? '',
            goal: payload.goal ?? '',
            photoDataUrl: payload.photoDataUrl ?? accounts[idx].profile?.photoDataUrl ?? '',
            phone: payload.phone ?? '',
            social: payload.social ?? '',
            optionalInfo: payload.optionalInfo ?? '',
            visibility: {
              photo: payload.visibility?.photo ?? true,
              phone: payload.visibility?.phone ?? false,
              social: payload.visibility?.social ?? false,
              optionalInfo: payload.visibility?.optionalInfo ?? false,
            },
          },
        }
        writeJson(LS_ACCOUNTS, accounts)
        setMember(stripPassword(accounts[idx]))
        return { ok: true }
      },
    }
  }, [isReady, member])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

