import type { LinkItem } from '../types'

interface QuickToolsProps {
  links: LinkItem[]
}

function getIcon(name: string): string {
  const icons: Record<string, string> = {
    '学习': 'fa-graduation-cap', '教务': 'fa-pen-to-square', '图书馆': 'fa-book', '邮箱': 'fa-envelope', '邮件': 'fa-envelope',
    'OA': 'fa-file-lines', '办公': 'fa-building', '报修': 'fa-wrench', '认证': 'fa-shield-halved', '流量': 'fa-wifi',
    '密码': 'fa-key', '一卡通': 'fa-credit-card', '宿舍': 'fa-bed', '水电': 'fa-bolt',
    'GitHub': 'fa-brands fa-github', 'CSDN': 'fa-code', '知网': 'fa-book-open', 'W3School': 'fa-globe',
    'B站': 'fa-video', 'bilibili': 'fa-video', '抖音': 'fa-brands fa-tiktok', '知乎': 'fa-message',
    '微博': 'fa-brands fa-weibo', '豆瓣': 'fa-film',
    '校历': 'fa-calendar', '学信网': 'fa-graduation-cap', '天眼查': 'fa-eye', '阿里云': 'fa-cloud', 'VPN': 'fa-lock', 'WebVPN': 'fa-lock',
  }
  for (const [key, icon] of Object.entries(icons)) {
    if (name.includes(key)) return icon
  }
  return 'fa-link'
}

export default function QuickTools({ links }: QuickToolsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-bolt text-brand dark:text-brand-light text-sm" />
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">快捷工具</h2>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-tool flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl
              bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm
              hover:border-brand/30 dark:hover:border-brand-light/30
              text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light no-underline"
            title={`${link.name} — ${link.description}`}
          >
            <div className="w-8 h-8 rounded-lg bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center
              text-brand dark:text-brand-light text-sm">
              <i className={`fa-solid ${getIcon(link.name)}`} />
            </div>
            <span className="text-[11px] font-medium text-center leading-tight">{link.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
