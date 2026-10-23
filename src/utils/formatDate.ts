const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
]

/** "منذ ساعتين" style relative time; falls back to "الآن". */
export function timeAgo(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  for (const [unit, secs] of UNITS) {
    if (Math.abs(seconds) >= secs) return rtf.format(Math.round(seconds / secs), unit)
  }
  return 'الآن'
}
