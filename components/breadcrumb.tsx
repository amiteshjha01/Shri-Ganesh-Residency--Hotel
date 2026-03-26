import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumbs({ items, variant = 'light' }: { items: BreadcrumbItem[], variant?: 'light' | 'dark' }) {
  const isDark = variant === 'dark'
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className={`inline-flex items-center text-sm font-medium transition-colors ${
              isDark ? 'text-white/80 hover:text-white' : 'text-foreground/80 hover:text-primary'
            }`}
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className={`w-4 h-4 mx-1 ${isDark ? 'text-white/40' : 'text-foreground/40'}`} />
              {item.href ? (
                <Link
                  href={item.href}
                  className={`ml-1 text-sm font-medium transition-colors md:ml-2 ${
                    isDark ? 'text-white/80 hover:text-white' : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`ml-1 text-sm font-bold uppercase tracking-widest text-[10px] md:ml-2 ${
                  isDark ? 'text-white' : 'text-foreground'
                }`}>
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
