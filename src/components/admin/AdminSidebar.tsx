'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package,
  ClipboardCheck,
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

type SidebarItem = {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: {
    title: string
    href: string
  }[]
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const sidebarItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      title: 'SaaS Management',
      href: '/admin/saas',
      icon: <Package className="h-5 w-5" />,
      submenu: [
        {
          title: 'All SaaS',
          href: '/admin/saas'
        },
        {
          title: 'Pending Approvals',
          href: '/admin/saas/pending'
        }
      ]
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Requests',
      href: '/admin/requests',
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />
    }
  ]

  // Check if a route is active
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href) 
                    ? "bg-primary text-primary-foreground" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
              
              {item.submenu && isActive(item.href) && (
                <ul className="mt-1 ml-4 pl-3 border-l border-gray-200 space-y-1">
                  {item.submenu.map((submenuItem) => (
                    <li key={submenuItem.href}>
                      <Link 
                        href={submenuItem.href}
                        className={cn(
                          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive(submenuItem.href) 
                            ? "text-primary" 
                            : "text-gray-600 hover:text-primary"
                        )}
                      >
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {submenuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: '/admin-login' })}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
} 