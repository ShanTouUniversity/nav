interface HeaderProps {
  isDark: boolean
  onToggleTheme: () => void
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full bg-white/85 dark:bg-gray-800/85 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2 text-brand dark:text-brand-light font-bold text-xl no-underline">
            <i className="fa-solid fa-compass text-2xl" />
            <span>ST.U 导航</span>
          </a>
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-6">
            <div className="text-center leading-tight"><span className="font-medium text-gray-700 dark:text-gray-300">有志</span><br />ASPIRATION</div>
            <div className="text-center leading-tight"><span className="font-medium text-gray-700 dark:text-gray-300">有识</span><br />KNOWLEDGE</div>
            <div className="text-center leading-tight"><span className="font-medium text-gray-700 dark:text-gray-300">有恒</span><br />PERSEVERANCE</div>
            <div className="text-center leading-tight"><span className="font-medium text-gray-700 dark:text-gray-300">有为</span><br />ACHIEVEMENT</div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="切换主题"
          >
            <i className={`fa-solid text-lg ${isDark ? 'fa-sun' : 'fa-moon'}`} />
          </button>
          <a
            href="https://github.com/ShanTouUniversity/nav"
            target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="GitHub 仓库"
          >
            <i className="fa-brands fa-github text-lg" />
          </a>
        </nav>
      </div>
    </header>
  )
}
