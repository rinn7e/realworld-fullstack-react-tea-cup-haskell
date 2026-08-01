export type BreadcrumbItem = {
  label: string
  href?: string
  isActive?: boolean
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: 'bullet' | 'dot' | 'succeeds' | 'arrow'
  align?: 'left' | 'center' | 'right'
  onSelect?: (item: BreadcrumbItem) => void
  className?: string
}
