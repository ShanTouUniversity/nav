import { useRef, useEffect } from 'react'

export function useDebounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => () => clearTimeout(timer.current), [])

  return ((...args: never[]) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => fnRef.current(...args), ms)
  }) as T
}
