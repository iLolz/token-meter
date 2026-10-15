import type { Register, SessionMeasureInput } from 'claude-code'

type Figures = Pick<SessionMeasureInput, 'context' | 'rateLimits' | 'cost'>

const LABEL: Record<string, string> = {
  five_hour: '5h',
  seven_day: '7d',
  spend_limit: 'gasto',
}

const compact = (n: number) =>
  n >= 1_000_000
    ? `${+(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${Math.round(n / 1_000)}k`
      : `${n}`

const bar = (percent: number) => {
  const filled = Math.max(0, Math.min(5, Math.round(percent / 20)))
  return '▰'.repeat(filled) + '▱'.repeat(5 - filled)
}

const resetIn = (iso: string | undefined, now: number) => {
  if (!iso) return ''
  const ms = Date.parse(iso) - now
  if (!(ms > 0)) return ''
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return h >= 24 ? ` ↻${Math.floor(h / 24)}d${h % 24}h` : h > 0 ? ` ↻${h}h${m}m` : ` ↻${m}m`
}

export const line = (f: Figures, now: number): string | undefined => {
  const parts: string[] = []
  const { tokens, window, percent } = f.context
  if (tokens !== undefined) {
    parts.push(`ctx ${compact(tokens)}/${compact(window)}${percent !== undefined ? ` (${percent}%)` : ''}`)
  }
  for (const r of f.rateLimits) {
    parts.push(`${LABEL[r.kind] ?? r.kind} ${bar(r.percentUsed)} ${r.percentUsed}%${resetIn(r.resetsAt, now)}`)
  }
  if (f.cost && f.cost.usd > 0) parts.push(`US$ ${f.cost.usd.toFixed(2)}`)
  return parts.length ? parts.join(' · ') : undefined
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const result = await next(e)
    $.ui.status(line(await $.session.usage(), await $.clock.now()))
    return result
  })

  on('session.measure', async ($, e, next) => {
    $.ui.status(line(e, await $.clock.now()))
    return next(e)
  })
}
