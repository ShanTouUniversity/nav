document.addEventListener('DOMContentLoaded', () => {
    let navigationData = null;

    // 加载导航数据
    async function loadNavigationData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading navigation data:', error);
            return null;
        }
    }

    // 渲染导航项
    function renderNavigation(categories) {
        const main = document.querySelector('main');
        categories.forEach(category => {
            const section = document.createElement('section');
            section.className = 'mb-12';
            section.innerHTML = `
                <h2 class="text-xl font-bold text-custom dark:text-custom-light mb-6">${category.name}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    ${category.links.map(link => `
                        <a href="${link.url}" target="_blank" 
                           class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg 
                                  transition-shadow flex flex-col relative ${link.isInternal ? 'internal-link' : ''}">
                            ${link.isInternal ? '<span class="absolute top-2 right-2 text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded">内网</span>' : ''}
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 pr-16">
                                ${link.name}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                                ${link.description}
                            </p>
                        </a>
                    `).join('')}
                </div>
            `;
            main.appendChild(section);
        });
    }

    // 搜索功能
    function setupSearch() {
        const searchInput = document.querySelector('input[type="text"]');
        const searchButton = document.querySelector('button');
        const searchResults = document.getElementById('search-results');

        function performSearch() {
            const query = searchInput.value.toLowerCase();
            if (!query) {
                searchResults.style.display = 'none';
                return;
            }

            const results = [];
            navigationData.categories.forEach(category => {
                category.links.forEach(link => {
                    if (link.name.toLowerCase().includes(query) ||
                        link.description.toLowerCase().includes(query)) {
                        results.push({ ...link, category: category.name });
                    }
                });
            });

            if (results.length > 0) {
                searchResults.innerHTML = results.map(result => `
                    <a href="${result.url}" target="_blank" 
                       class="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b 
                              border-gray-100 dark:border-gray-700 last:border-0 relative">
                        <div class="font-semibold text-gray-900 dark:text-gray-100 pr-16">
                            ${result.name}
                            ${result.isInternal ? '<span class="absolute top-4 right-4 text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded">内网</span>' : ''}
                        </div>
                        <div class="text-sm">
                            <span class="text-custom dark:text-custom-light">${result.category}</span>
                            <span class="text-gray-600 dark:text-gray-400"> - ${result.description}</span>
                        </div>
                    </a>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = `
                    <div class="p-4 text-gray-600 dark:text-gray-400">
                        未找到相关结果
                    </div>
                `;
                searchResults.style.display = 'block';
            }
        }

        searchInput.addEventListener('input', performSearch);
        searchButton.addEventListener('click', performSearch);

        // 点击其他地方时隐藏搜索结果
        document.addEventListener('click', (e) => {
            if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // 初始化
    async function initialize() {
        navigationData = await loadNavigationData();
        if (!navigationData) return;
        renderNavigation(navigationData.categories);
        setupSearch();
    }

    initialize();
});
