import type { Category } from '../types'

interface CategoryPillsProps {
  categories: Category[]
  active: string
  onChange: (id: string) => void
}

export default function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            className={`category-pill flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium
              ${active === 'all' ? 'active' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            onClick={() => onChange('all')}
          >
            <i className="fa-solid fa-grid-2 mr-1.5" />全部
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-pill flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium
                ${active === cat.id ? 'active' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => onChange(cat.id)}
            >
              <i className={`${cat.icon} mr-1.5`} />{cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
