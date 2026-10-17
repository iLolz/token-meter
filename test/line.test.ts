import { test, expect } from 'claude-code/testing'
import { line } from '../hooks/register.ts'

const now = Date.parse('2026-10-14T12:00:00Z')

test('contexto, limites com reset e custo numa linha', async () => {
  const text = line(
    {
      context: { tokens: 123_456, window: 1_000_000, percent: 12 },
      rateLimits: [
        { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-10-14T14:30:00Z' },
        { kind: 'seven_day', percentUsed: 61, resetsAt: '2026-10-16T19:00:00Z' },
      ],
      cost: { usd: 4.2 },
    },
    now,
  )
  expect(text).toBe(
    'ctx 123k/1M (12%) · 5h 🟩⬜⬜⬜⬜ 23.5% ↻2h30m · 7d 🟨🟨🟨⬜⬜ 61% ↻2d7h · US$ 4.20',
  )
})

test('barra verde até 2, amarela em 3 e vermelha em 4 e 5', async () => {
  const bars = [5, 30, 60, 80, 95].map(percentUsed =>
    line({ context: { window: 200_000 }, rateLimits: [{ kind: 'five_hour', percentUsed }] }, now),
  )
  expect(bars).toEqual([
    '5h ⬜⬜⬜⬜⬜ 5%',
    '5h 🟩🟩⬜⬜⬜ 30%',
    '5h 🟨🟨🟨⬜⬜ 60%',
    '5h 🟥🟥🟥🟥⬜ 80%',
    '5h 🟥🟥🟥🟥🟥 95%',
  ])
})

test('sem leitura nenhuma limpa a linha', async () => {
  expect(line({ context: { window: 200_000 }, rateLimits: [] }, now)).toBe(undefined)
})
