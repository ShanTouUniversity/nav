import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* quota exceeded etc. */ }
  }, [key, value])

  const set = useCallback((v: T) => setValue(v), [])
  return [value, set]
}
