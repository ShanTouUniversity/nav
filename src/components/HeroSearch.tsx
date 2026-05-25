import { useState, useRef, useCallback } from 'react'
import { Input as BaseInput } from '@mui/base/Input'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import type { Category } from '../types'

interface HeroSearchProps {
  categories: Category[]
  onSearch: (q: string) => void
}

function getLinkIcon(name: string): string {
  const icons: Record<string, string> = {
    '学习': 'fa-graduation-cap', '教务': 'fa-pen-to-square', '图书馆': 'fa-book', '邮箱': 'fa-envelope',
    'OA': 'fa-file-lines', '办公': 'fa-building', '报修': 'fa-wrench', '认证': 'fa-shield-halved',
    'GitHub': 'fa-brands fa-github', 'CSDN': 'fa-code', '知网': 'fa-book-open', 'B站': 'fa-video',
    '抖音': 'fa-brands fa-tiktok', '知乎': 'fa-message', '微博': 'fa-brands fa-weibo', '豆瓣': 'fa-film',
  }
  for (const [key, icon] of Object.entries(icons)) {
    if (name.includes(key)) return icon
  }
  return 'fa-link'
}

function highlight(text: string, query: string): string {
  if (!query) return text
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<span class="search-highlight">$1</span>')
}

export default function HeroSearch({ categories, onSearch }: HeroSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; url: string; description: string; category: string; isInternal?: boolean }[]>([])
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const performSearch = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    const lower = q.toLowerCase()
    const hits: typeof results = []
    categories.forEach(cat => {
      cat.links.forEach(link => {
        if (link.name.toLowerCase().includes(lower) || link.description.toLowerCase().includes(lower)) {
          hits.push({ ...link, category: cat.name })
        }
      })
    })
    setResults(hits.slice(0, 10))
    setOpen(true)
  }, [categories])

  const handleSubmit = useCallback(() => {
    onSearch(query)
    setOpen(false)
  }, [query, onSearch])

  return (
    <section className="hero-gradient pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand dark:text-brand-light mb-3">
            汕头大学校园导航
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            快捷访问校内系统、学习资源与校园服务 —— 类似郁金香导航的汕大专属导航
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto animate-[slideUp_0.6s_ease-out_0.2s_both]">
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div ref={inputRef}>
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <BaseInput
                    slotProps={{
                      input: {
                        className: 'w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-brand-light/50 dark:border-brand-dark/50 rounded-xl focus:outline-none focus:border-brand dark:focus:border-brand-light text-sm placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-colors',
                        placeholder: '搜索网站名称或描述...',
                      },
                    }}
                    value={query}
                    onChange={(_: React.ChangeEvent<HTMLInputElement>, v?: string) => performSearch(v ?? '')}
                    onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSubmit() }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="px-6 sm:px-8 py-3.5 bg-brand dark:bg-brand-dark text-white rounded-xl hover:bg-brand-dark dark:hover:bg-brand font-medium text-sm transition-colors shadow-sm whitespace-nowrap"
                >
                  搜索
                </button>
              </div>

              {open && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 overflow-hidden border border-gray-100 dark:border-gray-700">
                  {results.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
                      <i className="fa-solid fa-search text-xl mb-2" />
                      <p>没有找到相关结果</p>
                    </div>
                  ) : (
                    results.map((r, i) => {
                      const icon = getLinkIcon(r.name)
                      return (
                        <a
                          key={i}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors no-underline"
                        >
                          <div className="w-7 h-7 rounded-md bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center text-brand dark:text-brand-light text-xs flex-shrink-0">
                            <i className={`fa-solid ${icon}`} />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" dangerouslySetInnerHTML={{ __html: highlight(r.name, query) }} />
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              <span className="text-brand dark:text-brand-light">{r.category}</span>
                              <span className="mx-1">·</span>
                              <span dangerouslySetInnerHTML={{ __html: highlight(r.description, query) }} />
                            </div>
                          </div>
                          {r.isInternal && (
                            <span className="text-[10px] px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded whitespace-nowrap">内网</span>
                          )}
                        </a>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </section>
  )
}
