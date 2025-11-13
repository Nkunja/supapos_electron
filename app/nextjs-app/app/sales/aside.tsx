"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  BarChart3,
  FileText,
  Package,
  Box,
  CreditCard,
  Wrench,
  ChevronRight,
} from "lucide-react";

interface SalesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SalesSidebar({ isOpen, onClose }: SalesSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/sales",
      description: "Dashboard overview",
    },
    {
      id: "sales",
      label: "Sales",
      icon: ShoppingCart,
      href: "/sales/pos",
      description: "Point of Sale",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      href: "/sales/reports",
      description: "Sales analytics",
    },
    {
      id: "purchase-orders",
      label: "Purchase Orders",
      icon: FileText,
      href: "/sales/purchase-orders",
      description: "Manage orders",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      href: "/sales/inventory",
      description: "Stock management",
    },
    {
      id: "products",
      label: "Products",
      icon: Box,
      href: "/sales/products",
      description: "Product catalog",
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: CreditCard,
      href: "/sales/invoices",
      description: "Manage invoices",
    },
    {
      id: "credit-notes",
      label: "Credit Notes",
      icon: CreditCard,
      href: "/sales/credit-notes",
      description: "Refunds & credits",
    },
    {
      id: "customer",
      label: "Customers",
      icon: CreditCard,
      href: "/sales/customer",
      description: "Customers",
    },
    {
      id: "Vendors",
      label: "Vendors",
      icon: CreditCard,
      href: "/sales/vendor",
      description: "Vendors",
    },
    {
      id: "utilities",
      label: "Utilities",
      icon: Wrench,
      href: "/sales/utilities",
      description: "Extras & supplies",
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close sidebar on mobile after navigation
  };

  const isActive = (href: string) => {
    if (href === "/sales") {
      return pathname === "/sales" || pathname === "/sales/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
          flex flex-col
        `}
      >
        <nav className="flex-1 mt-6 px-4 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`
                    w-5 h-5 mr-3 transition-colors
                    ${
                      active
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }
                  `}
                  />

                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div
                      className={`
                      text-xs mt-0.5 transition-colors
                      ${
                        active
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }
                    `}
                    >
                      {item.description}
                    </div>
                  </div>

                  {active && <ChevronRight className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
