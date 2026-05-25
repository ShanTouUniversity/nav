import type { Category, LinkItem } from '../types'
import LinkCard from './LinkCard'

interface CategorySectionProps {
  category: Category
  links: LinkItem[]
  query: string
  favUrls: string[]
  onToggleFav: (url: string) => void
}

export default function CategorySection({ category, links, query, favUrls, onToggleFav }: CategorySectionProps) {
  return (
    <section className="mb-10" data-category={category.id}>
      <div className="flex items-center gap-2 mb-4">
        <i className={`${category.icon} text-brand dark:text-brand-light text-sm`} />
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">{category.name}</h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{links.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {links.map((link, i) => (
          <LinkCard
            key={`${link.url}-${i}`}
            link={link}
            query={query}
            isFav={favUrls.includes(link.url)}
            onToggleFav={onToggleFav}
          />
        ))}
      </div>
    </section>
  )
}
