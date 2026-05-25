import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 w-11 h-11 flex items-center justify-center rounded-xl
        bg-brand dark:bg-brand-dark text-white shadow-lg z-40
        hover:bg-brand-dark dark:hover:bg-brand transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      title="返回顶部"
    >
      <i className="fa-solid fa-arrow-up" />
    </button>
  )
}
