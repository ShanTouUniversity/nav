export interface LinkItem {
  name: string
  url: string
  description: string
  isInternal?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  links: LinkItem[]
}
