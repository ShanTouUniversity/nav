export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div>
            <div className="flex items-center gap-2 text-brand dark:text-brand-light font-bold text-base mb-3">
              <i className="fa-solid fa-compass" />
              <span>ST.U 导航</span>
            </div>
            <p className="leading-relaxed">汕头大学校园导航网站，汇集校内系统、教学单位、校园服务、学习资源等便捷入口。类似郁金香导航的大学校园网址导航，为汕大师生提供一站式服务。</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">相关链接</h3>
            <ul className="space-y-2">
              <li><a href="https://www.stu.edu.cn" target="_blank" rel="noopener noreferrer" className="hover:text-brand dark:hover:text-brand-light transition-colors">汕头大学官网</a></li>
              <li><a href="https://github.com/ShanTouUniversity/nav" target="_blank" rel="noopener noreferrer" className="hover:text-brand dark:hover:text-brand-light transition-colors">GitHub 仓库</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">关于</h3>
            <p className="leading-relaxed">校訓：有志、有识、有恒、有为</p>
            <p className="mt-1">地址：广东省汕头市大学路243号</p>
            <p className="mt-4 text-xs">&copy; {new Date().getFullYear()} ST.U 导航 · 汕头大学</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
