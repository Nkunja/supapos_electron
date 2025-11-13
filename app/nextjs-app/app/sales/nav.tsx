'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Store,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  Activity,
  TrendingUp,
  Package,
  Receipt,
  Image,
  Menu,
  X
} from 'lucide-react';
import { useAuthContext } from '@/lib/context/auth';
import { User } from '@/types/user';

interface SalesNavbarProps {
  user: User | null;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function SalesNavbar({ user, onMenuClick, isSidebarOpen }: SalesNavbarProps) {
  const { logout } = useAuthContext();
  const [notifications] = useState([
    { id: 1, message: 'Low stock alert: Ibuprofen 400mg', time: '10m ago', unread: true },
    { id: 2, message: 'Daily sales target achieved!', time: '1h ago', unread: true },
    { id: 3, message: 'New product added to inventory', time: '2h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Menu toggle button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              SupaPos Sales
            </h1>
            <p className="text-sm text-slate-600">Point of Sale System</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="hidden lg:block">
          <p className="text-sm text-slate-600">
            {getWelcomeMessage()}, <span className="font-semibold text-slate-900">{user?.first_name}</span>! 👋
          </p>
          <p className="text-xs text-slate-500">Ready to make some sales today?</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden xl:flex items-center space-x-4 mr-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
            {/* <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">Today's Sales</p>
              <p className="text-sm font-bold text-green-700">KSh 15,420</p>
            </div> */}
          </div>
          {/* <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
            <Receipt className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-medium">Transactions</p>
              <p className="text-sm font-bold text-blue-700">45</p>
            </div>
          </div> */}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold">Notifications</span>
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex items-start w-full">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.unread ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 ml-2"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-blue-600 font-medium hover:bg-blue-50">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-slate-100 rounded-xl">
              <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.first_name || 'Sales User'}
                </p>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-blue-600" />
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role || 'Salesperson'}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.first_name || 'Sales User'}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || 'No email'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Activity className="h-3 w-3 text-blue-600" />
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {user?.role || 'Salesperson'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-slate-50">
              <Image className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">
              <Package className="mr-2 h-4 w-4" />
              <span>Inventory</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}