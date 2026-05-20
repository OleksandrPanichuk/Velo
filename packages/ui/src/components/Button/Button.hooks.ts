import * as React from "react"

const RIPPLE_DURATION_MS = 500
const MAX_VISIBLE_RIPPLES = 6

export interface Ripple {
  x: number
  y: number
  size: number
  id: number
}

export function useRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const idRef = React.useRef(0)
  const timeoutIdsRef = React.useRef(new Set<number>())

  const addRipple = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()

    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    const id = ++idRef.current

    setRipples((prev) => {
      const next = prev.length >= MAX_VISIBLE_RIPPLES ? prev.slice(-(MAX_VISIBLE_RIPPLES - 1)) : prev
      return [...next, { x, y, size, id }]
    })

    const timeoutId = window.setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
      timeoutIdsRef.current.delete(timeoutId)
    }, RIPPLE_DURATION_MS)

    timeoutIdsRef.current.add(timeoutId)
  }, [])

  React.useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timeoutIds.clear()
    }
  }, [])

  return { ripples, addRipple }
}
