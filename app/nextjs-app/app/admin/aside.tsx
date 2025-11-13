'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  BarChart3,
  AlertTriangle,
  Settings,
  FileText,
  TrendingUp,
  Pill,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin'
  },
  {
    title: 'User Management',
    icon: Users,
    children: [
      { title: 'All Users', icon: Users, href: '/admin/users' },
      // { title: 'Salespersons', icon: Users, href: '/admin/users/salespersons' },
      { title: 'Add User', icon: Users, href: '/admin/users/add' }
    ]
  },
  {
    title: 'Shops',
    icon: Store,
    children: [
      { title: 'All Shops', icon: Store, href: '/admin/shops' },
      { title: 'Shop Assignment', icon: Store, href: '/admin/shops/assign' },
      { title: 'Add Shop', icon: Store, href: '/admin/shops/add' }
    ]
  },
  {
    title: 'Products',
    icon: Package,
    href: '/admin/products',
    children: [
      { title: 'All Products', icon: Package, href: '/admin/products' },
      // { title: 'Categories', icon: Package, href: '/admin/products/categories' },
      // { title: 'Add Product', icon: Package, href: '/admin/products/add' }
    ]
  },
  {
    title: 'Inventory',
    icon: Pill,
    badge: '12',
    href: '/admin/inventory',
    children: [
      { title: 'All Inventory', icon: Pill, href: '/admin/inventory' },
      // { title: 'Low Stock', icon: AlertTriangle, href: '/admin/inventory/low-stock', badge: '5' },
      // { title: 'Expired Items', icon: AlertTriangle, href: '/admin/inventory/expired', badge: '3' },
      // { title: 'Stock Alerts', icon: AlertTriangle, href: '/admin/inventory/alerts', badge: '12' }
    ]
  },
  {
    title: 'Sales',
    icon: ShoppingCart,
    href: '/admin/sales',
    children: [
      { title: 'Sales History', icon: ShoppingCart, href: '/admin/sales' },
      // { title: 'Daily Reports', icon: FileText, href: '/admin/sales/daily' },
      // { title: 'Performance', icon: TrendingUp, href: '/admin/sales/performance' }
    ]
  },
  {
    title: 'Reports',
    icon: BarChart3,
    children: [
      { title: 'Sales Reports', icon: BarChart3, href: '/admin/reports/sales' },
      { title: 'Inventory Reports', icon: BarChart3, href: '/admin/reports/inventory' },
      { title: 'User Reports', icon: BarChart3, href: '/admin/reports/users' }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  }
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['User Management']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const isParentActive = (children: MenuItem[]) => {
    return children.some(child => child.href && isActive(child.href));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const isItemActive = item.href ? isActive(item.href) : false;
    const isChildActive = hasChildren ? isParentActive(item.children!) : false;

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              "w-full justify-start font-normal h-10 px-3",
              depth > 0 && "ml-4 w-[calc(100%-1rem)]",
              (isChildActive || isExpanded) && "bg-blue-50 text-blue-700"
            )}
          >
            <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="destructive" className="ml-2 h-5 text-xs">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />
            )}
          </Button>
          {isExpanded && (
            <div className="ml-2 space-y-1">
              {item.children!.map(child => renderMenuItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    const content = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal h-10 px-3",
          depth > 0 && "ml-4 w-[calc(100%-1rem)]",
          isItemActive && "bg-blue-100 text-blue-700 font-medium"
        )}
      >
        <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
        <span className="flex-1 text-left">{item.title}</span>
        {item.badge && (
          <Badge variant="destructive" className="ml-2 h-5 text-xs">
            {item.badge}
          </Badge>
        )}
      </Button>
    );

    return (
      <div key={item.title}>
        {item.href ? (
          <Link href={item.href} onClick={onClose}>
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">SupaPos</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>SupaPos v1.0</p>
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}