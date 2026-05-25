import type { LinkItem } from '../types'

interface LinkCardProps {
  link: LinkItem
  query: string
  isFav: boolean
  onToggleFav: (url: string) => void
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

export default function LinkCard({ link, query, isFav, onToggleFav }: LinkCardProps) {
  const icon = getLinkIcon(link.name)
  const extraPad = link.isInternal ? 'pt-7' : ''

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-hover group relative p-4 ${extraPad} bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700
        shadow-sm hover:border-brand/30 dark:hover:border-brand-light/30 block`}
    >
      <button
        onClick={e => { e.stopPropagation(); e.preventDefault(); onToggleFav(link.url) }}
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-md
          text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors"
        title={isFav ? '取消收藏' : '加入收藏'}
      >
        <i className={`fa-solid fa-heart${isFav ? ' text-red-400' : ''}`} />
      </button>
      {link.isInternal && (
        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/40
          text-yellow-700 dark:text-yellow-300 rounded-full border border-yellow-200 dark:border-yellow-700">
          内网
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center
          text-brand dark:text-brand-light text-sm flex-shrink-0
          group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-light dark:group-hover:text-gray-900 transition-colors">
          <i className={`fa-solid ${icon}`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 pr-2 truncate"
            dangerouslySetInnerHTML={{ __html: query ? highlight(link.name, query) : link.name }}
          />
          <p
            className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: query ? highlight(link.description, query) : link.description }}
          />
        </div>
      </div>
    </a>
  )
}
