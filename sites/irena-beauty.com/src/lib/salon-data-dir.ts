import path from 'path'

/**
 * JSON storage for this site + `/admin` (same Next.js app / same port). The Telegram/WhatsApp
 * bot (`aiterra-assistant`) is a separate process — point it at this folder via SALON_DATA_DIR
 * or SALON_TENANTS_JSON. For another machine, set SALON_DATA_DIR to the same absolute path.
 */
export function getSalonDataDir(): string {
  const fromEnv = process.env.SALON_DATA_DIR?.trim()
  if (fromEnv) return path.resolve(fromEnv)
  return path.join(process.cwd(), 'data')
}
