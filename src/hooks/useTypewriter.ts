import { useEffect, useState } from 'react'

/**
 * Reveals `text` one character at a time.
 * `start` lets a caller hold the animation until something is on screen.
 */
export function useTypewriter(text: string, speed = 38, startDelay = 600, start = true) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!start) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text)
      setDone(true)
      return
    }

    let i = 0
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [text, speed, startDelay, start])

  return { displayed, done }
}
