document.addEventListener('DOMContentLoaded', () => {
  let navigationData = null
  let activeCategory = 'all'
  let searchQuery = ''

  const $ = id => document.getElementById(id)
  const qsa = (sel, ctx) => (ctx || document).querySelectorAll(sel)

  const categoryPills = $('category-pills')
  const categorySections = $('category-sections')
  const skeleton = $('skeleton')
  const searchInput = $('search-input')
  const searchBtn = $('search-btn')
  const searchResults = $('search-results')
  const quickTools = $('quick-tools')
  const backToTop = $('back-to-top')
  const footerYear = $('footer-year')

  function highlightText(text, query) {
    if (!query) return text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(re, '<span class="search-highlight">$1</span>')
  }

  function debounce(fn, ms = 250) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
  }

  function getFavorites() {
    try { return JSON.parse(localStorage.getItem('stu-nav-favs') || '[]') } catch { return [] }
  }

  function toggleFavorite(url) {
    let favs = getFavorites()
    favs.includes(url) ? favs = favs.filter(f => f !== url) : favs.push(url)
    localStorage.setItem('stu-nav-favs', JSON.stringify(favs))
    return favs.includes(url)
  }

  function isFavorite(url) {
    return getFavorites().includes(url)
  }

  function getLinkIcon(name) {
    const icons = {
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

  async function loadNavigationData() {
    try {
      const res = await fetch('data.json')
      return await res.json()
    } catch (err) {
      console.error('加载数据失败:', err)
      return null
    }
  }

  // ===================== PILLS =====================
  function renderPills(categories) {
    categories.forEach(cat => {
      const btn = document.createElement('button')
      btn.className = `category-pill flex-shrink-0 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600
                       text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
      btn.dataset.category = cat.id
      btn.innerHTML = `<i class="${cat.icon} mr-1.5"></i>${cat.name}`
      categoryPills.appendChild(btn)
    })

    categoryPills.addEventListener('click', e => {
      const pill = e.target.closest('.category-pill')
      if (!pill) return
      qsa('.category-pill').forEach(p => p.classList.remove('active'))
      pill.classList.add('active')
      activeCategory = pill.dataset.category
      searchQuery = searchInput.value.trim()
      renderCategorySections(navigationData.categories, activeCategory, searchQuery)
      $('nav-content').scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // ===================== CARDS =====================
  function renderCategorySections(categories, filter, query) {
    const container = categorySections
    container.innerHTML = ''

    const filtered = filter === 'all' ? categories : categories.filter(c => c.id === filter)
    let hasVisible = false

    filtered.forEach(category => {
      let links = category.links
      if (query) {
        const q = query.toLowerCase()
        links = links.filter(l =>
          l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
        )
      }
      if (links.length === 0) return
      hasVisible = true

      const section = document.createElement('section')
      section.className = 'mb-10'
      section.dataset.category = category.id

      section.innerHTML = `
        <div class="flex items-center gap-2 mb-4">
          <i class="${category.icon} text-brand dark:text-brand-light text-sm"></i>
          <h2 class="text-base font-bold text-gray-800 dark:text-gray-200">${category.name}</h2>
          <span class="text-xs text-gray-400 dark:text-gray-500 ml-auto">${links.length}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          ${links.map(link => renderCard(link, query)).join('')}
        </div>
      `
      container.appendChild(section)
    })

    if (!hasVisible) {
      container.innerHTML = query
        ? `<div class="text-center py-20 text-gray-400 dark:text-gray-500">
             <i class="fa-solid fa-search text-4xl mb-4"></i>
             <p class="text-sm">没有找到与 "<span class="text-brand font-medium">${query}</span>" 相关的结果</p>
           </div>`
        : `<div class="text-center py-20 text-gray-400 dark:text-gray-500">
             <i class="fa-solid fa-folder-open text-4xl mb-4"></i>
             <p class="text-sm">暂无可用的分类</p>
           </div>`
    }
  }

  function renderCard(link, query) {
    const fav = isFavorite(link.url)
    const icon = getLinkIcon(link.name)

    const extraPad = link.isInternal ? 'pt-7' : ''
    return `
      <a href="${link.url}" target="_blank" rel="noopener"
         class="card-hover group relative p-4 ${extraPad} bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700
                shadow-sm hover:border-brand/30 dark:hover:border-brand-light/30 block">
        <button class="fav-btn absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-md
                       text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors"
                data-url="${link.url}" title="${fav ? '取消收藏' : '加入收藏'}"
                onclick="event.stopPropagation(); event.preventDefault(); window.toggleFav('${link.url}')">
          <i class="fa-solid fa-heart${fav ? ' text-red-400' : ''}"></i>
        </button>
        ${link.isInternal
          ? `<span class="absolute top-2 left-2 text-[10px] px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/40
                     text-yellow-700 dark:text-yellow-300 rounded-full border border-yellow-200 dark:border-yellow-700">内网</span>`
          : ''}
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center
                      text-brand dark:text-brand-light text-sm flex-shrink-0
                      group-hover:bg-brand group-hover:text-white dark:group-hover:bg-brand-light dark:group-hover:text-gray-900
                      transition-colors">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 pr-2 truncate">
              ${query ? highlightText(link.name, query) : link.name}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              ${query ? highlightText(link.description, query) : link.description}
            </p>
          </div>
        </div>
      </a>`
  }

  // Expose for inline onclick
  window.toggleFav = function (url) {
    const now = toggleFavorite(url)
    qsa(`.fav-btn[data-url="${url}"]`).forEach(btn => {
      const heart = btn.querySelector('i')
      heart.classList.toggle('text-red-400', now)
      btn.title = now ? '取消收藏' : '加入收藏'
    })
  }

  // ===================== QUICK TOOLS =====================
  function renderQuickTools(categories) {
    const defaults = ['campus', 'learning', 'tools', 'learning_resources', 'campus_life', 'entertainment']
    const pools = []
    categories.forEach(c => {
      if (defaults.includes(c.id)) pools.push(...c.links)
    })

    const shown = pools.slice(0, 12)

    quickTools.innerHTML = shown.map(link => {
      const icon = getLinkIcon(link.name)
      return `
        <a href="${link.url}" target="_blank" rel="noopener"
           class="quick-tool flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl
                  bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm
                  hover:border-brand/30 dark:hover:border-brand-light/30
                  text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-brand-light no-underline"
           title="${link.name} — ${link.description}">
          <div class="w-8 h-8 rounded-lg bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center
                      text-brand dark:text-brand-light text-sm">
            <i class="fa-solid ${icon}"></i>
          </div>
          <span class="text-[11px] font-medium text-center leading-tight">${link.name}</span>
        </a>`
    }).join('')
  }

  // ===================== SEARCH =====================
  function performSearch() {
    searchQuery = searchInput.value.trim()
    if (searchQuery) {
      renderCategorySections(navigationData.categories, activeCategory, searchQuery)
      showSearchResults(searchQuery)
    } else {
      renderCategorySections(navigationData.categories, activeCategory, '')
      searchResults.classList.add('hidden')
    }
  }

  function showSearchResults(query) {
    const q = query.toLowerCase()
    const results = []
    navigationData.categories.forEach(cat => {
      cat.links.forEach(link => {
        if (link.name.toLowerCase().includes(q) || link.description.toLowerCase().includes(q)) {
          results.push({ ...link, category: cat.name })
        }
      })
    })

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="p-6 text-center text-sm text-gray-400 dark:text-gray-500">
          <i class="fa-solid fa-search text-xl mb-2"></i>
          <p>没有找到相关结果</p>
        </div>`
      searchResults.classList.remove('hidden')
      return
    }

    searchResults.innerHTML = results.slice(0, 10).map(r => {
      const icon = getLinkIcon(r.name)
      return `
        <a href="${r.url}" target="_blank" rel="noopener"
           class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors no-underline">
          <div class="w-7 h-7 rounded-md bg-brand/10 dark:bg-brand-dark/20 flex items-center justify-center
                      text-brand dark:text-brand-light text-xs flex-shrink-0">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              ${highlightText(r.name, query)}
            </div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <span class="text-brand dark:text-brand-light">${r.category}</span>
              <span class="mx-1">·</span>
              <span>${highlightText(r.description, query)}</span>
            </div>
          </div>
          ${r.isInternal ? '<span class="text-[10px] px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded whitespace-nowrap">内网</span>' : ''}
        </a>`
    }).join('')

    if (results.length > 10) {
      searchResults.innerHTML += `
        <div class="px-4 py-2 text-xs text-center text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-700/50">
          还有 ${results.length - 10} 个结果，请细化搜索
        </div>`
    }

    searchResults.classList.remove('hidden')
  }

  // ===================== BACK TO TOP =====================
  function setupBackToTop() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none')
        backToTop.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto')
      } else {
        backToTop.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none')
        backToTop.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto')
      }
    }, { passive: true })

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // ===================== INIT =====================
  async function initialize() {
    navigationData = await loadNavigationData()
    if (!navigationData) {
      skeleton.innerHTML = `
        <div class="text-center py-20 text-gray-400">
          <i class="fa-solid fa-exclamation-triangle text-3xl mb-4"></i>
          <p class="text-sm">数据加载失败，请刷新页面重试</p>
        </div>`
      return
    }

    renderPills(navigationData.categories)
    renderQuickTools(navigationData.categories)
    renderCategorySections(navigationData.categories, 'all', '')
    skeleton.style.display = 'none'

    searchInput.addEventListener('input', debounce(performSearch))
    searchBtn.addEventListener('click', performSearch)
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch() })

    document.addEventListener('click', e => {
      if (!searchResults.contains(e.target) && e.target !== searchInput && e.target !== searchBtn) {
        searchResults.classList.add('hidden')
      }
    })

    setupBackToTop()
    footerYear.textContent = new Date().getFullYear()
  }

  initialize()
})
