'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/dashboard" className="hover:text-primary transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {paths.map((path, i) => (
        <div key={i} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="capitalize text-muted-foreground">{path.replace(/-/g, ' ')}</span>
        </div>
      ))}
    </nav>
  )
}
