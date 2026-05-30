import fs from 'fs'
import path from 'path'
import { randomBytes } from 'crypto'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const TENANTS_FILE = path.join(getSalonDataDir(), 'messenger-tenants.json')
const LEGACY_FILE = path.join(getSalonDataDir(), 'messenger-broadcast.json')

export interface TelegramSubscriber {
  chatId: string
  username?: string | null
  subscribedAt: string
}

export interface WhatsAppSubscriber {
  chatId: string
  subscribedAt: string
}

export interface TenantBroadcast {
  label: string
  subscribeCode: string
  telegram: TelegramSubscriber[]
  whatsapp: WhatsAppSubscriber[]
}

export interface MessengerTenantsFile {
  version: number
  tenants: Record<string, TenantBroadcast>
}

/** API/UI payload for the logged-in admin (one tenant). */
export interface MessengerBroadcastState {
  tenantId: string
  tenantLabel: string
  subscribeCode: string
  telegram: TelegramSubscriber[]
  whatsapp: WhatsAppSubscriber[]
}

function makeCode(): string {
  return randomBytes(4).toString('hex').toUpperCase()
}

export function getSalonTenantId(): string {
  const raw = (process.env.SALON_TENANT_ID || 'default').trim().toLowerCase()
  const slug = raw.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return slug.slice(0, 64) || 'default'
}

export function getSalonTenantLabel(): string {
  const t = process.env.SALON_TENANT_LABEL?.trim()
  if (t) return t
  return getSalonTenantId()
}

function readRawFile(): MessengerTenantsFile {
  if (fs.existsSync(TENANTS_FILE)) {
    try {
      const raw = JSON.parse(fs.readFileSync(TENANTS_FILE, 'utf-8')) as Partial<MessengerTenantsFile>
      const tenants =
        raw.tenants && typeof raw.tenants === 'object' && !Array.isArray(raw.tenants)
          ? (raw.tenants as Record<string, TenantBroadcast>)
          : {}
      return { version: 1, tenants }
    } catch {
      return { version: 1, tenants: {} }
    }
  }
  return { version: 1, tenants: {} }
}

function migrateLegacyIfNeeded(): void {
  if (fs.existsSync(TENANTS_FILE) || !fs.existsSync(LEGACY_FILE)) return
  try {
    const raw = JSON.parse(fs.readFileSync(LEGACY_FILE, 'utf-8')) as Partial<{
      subscribeCode: string
      telegram: TelegramSubscriber[]
      whatsapp: WhatsAppSubscriber[]
    }>
    const initial: MessengerTenantsFile = {
      version: 1,
      tenants: {
        default: {
          label: '',
          subscribeCode:
            typeof raw.subscribeCode === 'string' && raw.subscribeCode.trim()
              ? raw.subscribeCode.trim().toUpperCase()
              : makeCode(),
          telegram: Array.isArray(raw.telegram) ? raw.telegram : [],
          whatsapp: Array.isArray(raw.whatsapp) ? raw.whatsapp : [],
        },
      },
    }
    writeFull(initial)
  } catch {
    /* ignore */
  }
}

function writeFull(state: MessengerTenantsFile): void {
  fs.mkdirSync(path.dirname(TENANTS_FILE), { recursive: true })
  fs.writeFileSync(TENANTS_FILE, JSON.stringify(state, null, 2), 'utf-8')
}

function allCodesExcept(state: MessengerTenantsFile, exceptTenantId: string): Set<string> {
  const s = new Set<string>()
  for (const [tid, t] of Object.entries(state.tenants)) {
    if (tid === exceptTenantId) continue
    const c = (t.subscribeCode || '').trim().toUpperCase()
    if (c) s.add(c)
  }
  return s
}

function uniqueCodeForTenant(state: MessengerTenantsFile, tenantId: string): string {
  const taken = allCodesExcept(state, tenantId)
  let code = makeCode()
  let n = 0
  while (taken.has(code) && n < 50) {
    code = makeCode()
    n += 1
  }
  return code
}

export function readMessengerBroadcast(): MessengerBroadcastState {
  migrateLegacyIfNeeded()
  const tenantId = getSalonTenantId()
  const tenantLabel = getSalonTenantLabel()
  let file = readRawFile()

  if (!file.tenants[tenantId]) {
    file.tenants[tenantId] = {
      label: tenantLabel,
      subscribeCode: uniqueCodeForTenant(file, tenantId),
      telegram: [],
      whatsapp: [],
    }
    writeFull(file)
  }

  const t = file.tenants[tenantId]
  if (!t.subscribeCode?.trim()) {
    t.subscribeCode = uniqueCodeForTenant(file, tenantId)
    t.label = tenantLabel
    file.tenants[tenantId] = t
    writeFull(file)
  }

  return {
    tenantId,
    tenantLabel: t.label || tenantLabel,
    subscribeCode: t.subscribeCode.trim().toUpperCase(),
    telegram: Array.isArray(t.telegram) ? t.telegram : [],
    whatsapp: Array.isArray(t.whatsapp) ? t.whatsapp : [],
  }
}

/** All Telegram chat IDs subscribed under this tenant (for instant booking alerts). */
export function listTelegramChatIdsForTenant(tenantId: string): string[] {
  migrateLegacyIfNeeded()
  const file = readRawFile()
  const t = file.tenants[tenantId]
  if (!t || !Array.isArray(t.telegram)) return []
  const out: string[] = []
  for (const row of t.telegram) {
    const id = typeof row.chatId === 'string' ? row.chatId.trim() : ''
    if (id) out.push(id)
  }
  return out
}

export function regenerateSubscribeCode(): MessengerBroadcastState {
  migrateLegacyIfNeeded()
  const tenantId = getSalonTenantId()
  const tenantLabel = getSalonTenantLabel()
  let file = readRawFile()
  if (!file.tenants[tenantId]) {
    readMessengerBroadcast()
    file = readRawFile()
  }
  const t = file.tenants[tenantId]
  t.subscribeCode = uniqueCodeForTenant(file, tenantId)
  t.label = tenantLabel
  file.tenants[tenantId] = t
  writeFull(file)
  return readMessengerBroadcast()
}
