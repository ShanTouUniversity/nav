import { useState, useEffect, useCallback, useRef } from 'react'
import categories from './data/links'
import type { LinkItem } from './types'
import { useLocalStorage } from './hooks/useLocalStorage'
import Header from './components/Header'
import HeroSearch from './components/HeroSearch'
import CategoryPills from './components/CategoryPills'
import QuickTools from './components/QuickTools'
import CategorySection from './components/CategorySection'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', getInitialTheme())
  const [favUrls, setFavUrls] = useLocalStorage<string[]>('stu-nav-favs', [])
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const navRef = useRef<HTMLElement>(null)

  const isDark = theme === 'dark'
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    if (!localStorage.getItem('theme')) {
      document.documentElement.classList.toggle('dark', mq.matches)
    }
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark')
  }, [isDark, setTheme])

  const toggleFav = useCallback((url: string) => {
    setFavUrls(
      favUrls.includes(url)
        ? favUrls.filter(f => f !== url)
        : [...favUrls, url],
    )
  }, [favUrls, setFavUrls])

  const filtered = activeCategory === 'all'
    ? categories
    : categories.filter(c => c.id === activeCategory)

  function matchesQuery(link: LinkItem, q: string): boolean {
    if (!q) return true
    const lower = q.toLowerCase()
    return link.name.toLowerCase().includes(lower) ||
      link.description.toLowerCase().includes(lower)
  }

  const quickIds = ['campus', 'learning', 'tools', 'learning_resources', 'campus_life', 'entertainment']
  const quickLinks = categories
    .filter(c => quickIds.includes(c.id))
    .flatMap(c => c.links)
    .slice(0, 12)

  function scrollToNav() {
    navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <Header isDark={isDark} onToggleTheme={toggleTheme} />

      <HeroSearch
        categories={categories}
        onSearch={q => { setSearchQuery(q); scrollToNav() }}
      />

      <CategoryPills
        categories={categories}
        active={activeCategory}
        onChange={id => { setActiveCategory(id); scrollToNav() }}
      />

      <QuickTools links={quickLinks} />

      <main ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filtered.map(cat => {
          const links = cat.links.filter(l => matchesQuery(l, searchQuery))
          if (links.length === 0) return null
          return (
            <CategorySection
              key={cat.id}
              category={cat}
              links={links}
              query={searchQuery}
              favUrls={favUrls}
              onToggleFav={toggleFav}
            />
          )
        })}

        {filtered.every(c => c.links.filter(l => matchesQuery(l, searchQuery)).length === 0) && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <i className="fa-solid fa-search text-4xl mb-4" />
            <p className="text-sm">
              {searchQuery
                ? <>没有找到与 "<span className="text-brand font-medium">{searchQuery}</span>" 相关的结果</>
                : '暂无可用的分类'}
            </p>
          </div>
        )}
      </main>

      <BackToTop />
      <Footer />
    </div>
  )
}
