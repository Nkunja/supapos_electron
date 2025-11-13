'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Search,
  Bell,
  Menu,
  
  Settings,
  LogOut,
  HelpCircle,
  Palette,
  Pill,
  Shield,
  UsersIcon
} from 'lucide-react';
import { useAuthContext } from '@/lib/context/auth';
import { User } from '@/types/user';


interface AdminNavbarProps {
  onMenuClick: () => void;
  isSidebarOpen?: boolean;
  user: User | null; 
}

export function AdminNavbar({ onMenuClick, isSidebarOpen, user }: AdminNavbarProps) {
  const { logout } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, message: 'Low stock alert: Paracetamol 500mg', time: '5m ago', unread: true },
    { id: 2, message: 'New user registered: Jane Smith', time: '1h ago', unread: true },
    { id: 3, message: 'Daily sales report ready', time: '2h ago', unread: false },
    { id: 4, message: 'Monthly inventory check completed', time: '3h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
    }
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'salesperson':
        return 'bg-blue-100 text-blue-700';
      case 'manager':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <header className={` ${isSidebarOpen ?  'lg:ml-64 ml-40' : 'lg:ml-64 ml-0'} bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm`}>

      <div className="flex items-center space-x-4">

        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>

    
        <div className={`flex items-center space-x-3 ${isSidebarOpen ? 'lg:hidden' : 'lg:hidden'}`}>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900">SupaPos</h1>
          </div>
        </div>

        <form onSubmit={handleSearch} className="hidden md:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users, products, shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 lg:w-80 h-9 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4">
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
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
                  className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start w-full">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
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
            <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 h-auto hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`text-sm font-medium ${getRoleBadgeColor(user?.role || '')}`}>
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  {user?.role === 'admin' && <Shield className="h-3 w-3 text-red-600" />}
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || 'Unknown'}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || 'No email'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {user?.role === 'admin' && <Shield className="h-3 w-3 text-red-600" />}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleBadgeColor(user?.role || '')}`}
                  >
                    {user?.role || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-gray-50">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
              <Palette className="mr-2 h-4 w-4" />
              <span>Appearance</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50">
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