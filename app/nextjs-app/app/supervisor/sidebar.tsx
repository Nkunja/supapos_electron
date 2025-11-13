"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  Package,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  Activity,
  ChevronRight,
  UserCheck,
  ClipboardList,
  Archive,
} from "lucide-react";

interface SupervisorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupervisorSidebar({ isOpen, onClose }: SupervisorSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/supervisor",
      description: "Overview & analytics",
    },
    {
      id: "user-management",
      label: "User Management",
      icon: Users,
      href: "/supervisor/users",
      description: "Manage staff & roles",
    },
    {
      id: "purchase-orders",
      label: "Purchase Orders",
      icon: FileText,
      href: "/supervisor/purchase-orders",
      description: "Approve & track orders",
    },
    {
      id: "inventory",
      label: "Inventory Control",
      icon: Package,
      href: "/supervisor/inventory",
      description: "Stock oversight",
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
      href: "/supervisor/reports",
      description: "Business insights",
    },
    {
      id: "performance",
      label: "Performance",
      icon: TrendingUp,
      href: "/supervisor/performance",
      description: "Team & sales metrics",
    },
 
    {
      id: "approvals",
      label: "Approvals (Utilities)",
      icon: UserCheck,
      href: "/supervisor/approvals",
      description: "Manage utility approvals",
    },
    {
      id: "compliance",
      label: "Compliance",
      icon: Shield,
      href: "/supervisor/compliance",
      description: "Regulatory oversight",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/supervisor/settings",
      description: "System configuration",
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  const isActive = (href: string) => {
    if (href === "/supervisor") {
      return pathname === "/supervisor" || pathname === "/supervisor/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-10 w-72 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
          flex flex-col border-r border-slate-700
        `}
      >
        <div className="flex items-center px-6 py-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                SupaPos Pro
              </h1>
              <p className="text-xs text-slate-400">Supervisor Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 mt-4 px-4 pb-4 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`
                    w-5 h-5 mr-4 transition-all duration-200
                    ${
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-200"
                    }
                  `}
                  />

                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item.label}</div>
                    <div
                      className={`
                      text-xs mt-0.5 transition-colors
                      ${
                        active
                          ? "text-blue-100"
                          : "text-slate-500 group-hover:text-slate-400"
                      }
                    `}
                    >
                      {item.description}
                    </div>
                  </div>

                  {active && (
                    <ChevronRight className="w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="px-6 py-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-green-400">System Status</p>
              <p className="text-xs text-slate-400">All systems operational</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}