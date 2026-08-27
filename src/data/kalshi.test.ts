import { normalizeKalshiCandles } from './kalshi.ts'

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(`Test failed: ${message}`)
}

const points = normalizeKalshiCandles([
  {
    end_period_ts: 1_750_000_000,
    price: { close: null },
    yes_bid: { close: '0.5900' },
    yes_ask: { close: '0.6500' },
    volume: '0.00',
  },
  {
    end_period_ts: 1_750_086_400,
    price: { close: '0.6300' },
    volume: '125.00',
  },
])

assert(points.length === 2, 'historical candles should normalize into daily points')
assert(points[0].probability === 62, 'a missing trade price should use the valid historical bid/ask midpoint')
assert(points[1].probability === 63, 'a historical decimal trade price should normalize to percent')
assert(points[1].volume === 125, 'historical contract volume should remain numeric')

console.log('Kalshi adapter tests passed')
