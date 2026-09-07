/** Full study pages and their index have been retired in favor of the daily game. */
export function isRetiredStudyRoute(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized === '/studies' || normalized.startsWith('/studies/')
}
