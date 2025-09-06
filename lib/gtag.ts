export const GA_ID: string = process.env.NEXT_PUBLIC_GA_ID || 'G-PQ0PJ2D7EN'

/**
 * Send a pageview event to Google Analytics (gtag)
 */
export function pageview(url: string): void {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (!gtag) return
  gtag('config', GA_ID, {
    page_path: url,
  })
}

