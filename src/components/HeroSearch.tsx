import { useState, useRef, useCallback, useEffect } from 'react'
import { Input as BaseInput } from '@mui/base/Input'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import type { Category } from '../types'

interface HeroSearchProps {
  categories: Category[]
  onSearch: (q: string) => void
}

function getLinkIcon(name: string): string {
  const icons: Record<string, string> = {
    '学习': 'fa-graduation-cap', '教务': 'fa-pen-to-square', '图书馆': 'fa-book', '邮箱': 'fa-envelope', '邮件': 'fa-envelope',
    'OA': 'fa-file-lines', '办公': 'fa-building', '人事': 'fa-users', '财务': 'fa-coins', '资产': 'fa-server', '档案': 'fa-folder',
    '采购': 'fa-cart-shopping', '招标': 'fa-gavel', '报修': 'fa-wrench', '认证': 'fa-shield-halved', '流量': 'fa-wifi',
    '密码': 'fa-key', '一卡通': 'fa-credit-card', '宿舍': 'fa-bed', '水电': 'fa-bolt',
    'GitHub': 'fa-brands fa-github', 'CSDN': 'fa-code', '知网': 'fa-book-open', 'W3School': 'fa-globe',
    'B站': 'fa-video', 'bilibili': 'fa-video', '抖音': 'fa-brands fa-tiktok', '知乎': 'fa-message',
    '微博': 'fa-brands fa-weibo', '豆瓣': 'fa-film', '爱奇艺': 'fa-video', '腾讯视频': 'fa-video', '优酷': 'fa-video',
    '虎牙': 'fa-broadcast-tower', '斗鱼': 'fa-fish',
    '淘宝': 'fa-bag-shopping', '京东': 'fa-cart-shopping', '拼多多': 'fa-cart-plus',
    '美团': 'fa-utensils', '饿了么': 'fa-truck', '大众点评': 'fa-star', '什么值得买': 'fa-tags', '58同城': 'fa-building',
    '去哪儿': 'fa-plane', '快递': 'fa-truck-fast', '公交': 'fa-bus', '12306': 'fa-train',
    '校历': 'fa-calendar', '学信网': 'fa-graduation-cap', '天眼查': 'fa-eye', '阿里云': 'fa-cloud', 'VPN': 'fa-lock', 'WebVPN': 'fa-lock',
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

function debounce<T extends (...args: string[]) => void>(fn: T, ms = 250): T {
  let t: ReturnType<typeof setTimeout>
  return ((...a: string[]) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...a), ms)
  }) as T
}

export default function HeroSearch({ categories, onSearch }: HeroSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; url: string; description: string; category: string; isInternal?: boolean }[]>([])
  const [totalHits, setTotalHits] = useState(0)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  const performSearch = useCallback((q: string) => {
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      setTotalHits(0)
      setOpen(false)
      return
    }
    const lower = q.toLowerCase()
    const hits: { name: string; url: string; description: string; category: string; isInternal?: boolean }[] = []
    categories.forEach(cat => {
      cat.links.forEach(link => {
        if (link.name.toLowerCase().includes(lower) || link.description.toLowerCase().includes(lower)) {
          hits.push({ ...link, category: cat.name })
        }
      })
    })
    setTotalHits(hits.length)
    setResults(hits.slice(0, 10))
    setOpen(true)
  }, [categories])

  const debouncedSearch = useRef(debounce(performSearch)).current

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

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
                    onChange={(_: React.ChangeEvent<HTMLInputElement>, v?: string) => setQuery(v ?? '')}
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
                    <>
                      {results.map((r, i) => {
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
                    })}
                      {totalHits > 10 && (
                        <div className="px-4 py-2 text-xs text-center text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-700/50">
                          还有 {totalHits - 10} 个结果，请细化搜索
                        </div>
                      )}
                    </>
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
