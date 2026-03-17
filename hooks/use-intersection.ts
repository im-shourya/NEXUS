"use client"
import { useEffect, useRef, useState } from "react"

export function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect() } },
      { threshold: 0.15, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}

export function useCountUp(target: number, duration = 800, trigger = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const steps = 40
    const increment = target / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setValue(target); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, trigger, duration])
  return value
}
