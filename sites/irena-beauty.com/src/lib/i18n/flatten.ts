/**
 * Flatten / unflatten nested content objects to dot-path string maps.
 * Used by the admin translation editor so arbitrary leaf strings can be edited
 * generically. Arrays produce numeric path segments (e.g. `pricing.categories.0.title`).
 */

export type Flat = Record<string, string>

export function flatten(value: unknown, prefix = '', out: Flat = {}): Flat {
  if (value === null || value === undefined) return out
  if (typeof value === 'string') {
    out[prefix] = value
    return out
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    out[prefix] = String(value)
    return out
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      flatten(item, prefix ? `${prefix}.${i}` : String(i), out)
    })
    return out
  }
  if (typeof value === 'object') {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${key}` : key, out)
    }
    return out
  }
  return out
}

/**
 * Apply a flat dot-path map back onto a deep-cloned `template` object, overwriting
 * only the leaf strings present in `flat`. Keeping the template guarantees the
 * resulting shape (arrays, nested objects) always matches the code-defined type.
 */
export function unflattenOnto<T>(template: T, flat: Flat): T {
  const clone: T = structuredClone(template)
  for (const [path, raw] of Object.entries(flat)) {
    setPath(clone as unknown as Record<string, unknown>, path.split('.'), raw)
  }
  return clone
}

function setPath(target: Record<string, unknown>, segments: string[], value: string): void {
  let node: unknown = target
  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]
    if (node === null || typeof node !== 'object') return
    const container = node as Record<string, unknown>
    if (container[key] === undefined || container[key] === null) {
      // Create the next container based on the upcoming segment.
      const nextIsIndex = /^\d+$/.test(segments[i + 1])
      container[key] = nextIsIndex ? [] : {}
    }
    node = container[key]
  }
  const last = segments[segments.length - 1]
  if (node && typeof node === 'object') {
    ;(node as Record<string, unknown>)[last] = value
  }
}
