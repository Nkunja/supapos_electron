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
  Shield,
  LogOut,
  Settings,
  HelpCircle,
  Bell,
  Activity,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Menu,
  X,
  Search,
  MessageSquare,
  UserCheck,
  Clock
} from 'lucide-react';
import { useAuthContext } from '@/lib/context/auth';
import { User } from '@/types/user';

interface SupervisorNavbarProps {
  user: User | null;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

export function SupervisorNavbar({ user, onMenuClick, isSidebarOpen }: SupervisorNavbarProps) {
  const { logout } = useAuthContext();
  const [notifications] = useState([
    { 
      id: 1, 
      message: 'Purchase Order #PO-2024-001 requires approval', 
      time: '5m ago', 
      unread: true,
      type: 'approval',
      priority: 'high'
    },
    { 
      id: 2, 
      message: 'Low stock alert: Critical medications below threshold', 
      time: '15m ago', 
      unread: true,
      type: 'alert',
      priority: 'high'
    },
    { 
      id: 3, 
      message: 'New user Sarah Johnson registered - pending approval', 
      time: '30m ago', 
      unread: true,
      type: 'user',
      priority: 'medium'
    },
    { 
      id: 4, 
      message: 'Daily sales report generated successfully', 
      time: '1h ago', 
      unread: false,
      type: 'report',
      priority: 'low'
    },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const urgentCount = notifications.filter(n => n.unread && n.priority === 'high').length;

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
    return 'S';
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval': return <UserCheck className="h-4 w-4 text-amber-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'user': return <Users className="h-4 w-4 text-blue-600" />;
      case 'report': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 h-18 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-6">
        {/* Menu toggle button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 lg:hidden transition-all"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-purple-700 bg-clip-text text-transparent">
              SupaPos Pro
            </h1>
            <p className="text-sm text-slate-600">Supervisor Dashboard</p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="hidden lg:block">
          <p className="text-sm text-slate-700 font-medium">
            {getWelcomeMessage()}, <span className="font-bold text-purple-700">{user?.first_name}</span>! 👋
          </p>
          <p className="text-xs text-slate-500">Managing operations with excellence</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Stats - Hidden on smaller screens */}
        <div className="hidden xl:flex items-center space-x-4 mr-6">
          <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-green-700 font-semibold">Today's Revenue</p>
              <p className="text-sm font-bold text-green-800">KSh 47,280</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-blue-700 font-semibold">Active Staff</p>
              <p className="text-sm font-bold text-blue-800">12/15</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs text-amber-700 font-semibold">Pending Approvals</p>
              <p className="text-sm font-bold text-amber-800">7</p>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button variant="ghost" size="sm" className="hidden md:flex p-2 hover:bg-slate-100 rounded-xl">
          <Search className="h-5 w-5 text-slate-600" />
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100 rounded-xl">
          <MessageSquare className="h-5 w-5 text-slate-600" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500 text-white border-2 border-white">
            3
          </Badge>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2 hover:bg-slate-100 rounded-xl">
              <Bell className="h-5 w-5 text-slate-600" />
              {unreadCount > 0 && (
                <Badge className={`absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs border-2 border-white ${urgentCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white`}>
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold">Notifications</span>
              <div className="flex space-x-2">
                {urgentCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {urgentCount} urgent
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start p-4 cursor-pointer hover:bg-slate-50"
                >
                  <div className="flex items-start w-full space-x-3">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.unread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-slate-500">{notification.time}</p>
                        <Badge 
                          variant={notification.priority === 'high' ? 'destructive' : notification.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs px-1.5 py-0.5"
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    {notification.unread && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-purple-600 font-medium hover:bg-purple-50">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-slate-100 rounded-xl">
              <Avatar className="h-10 w-10 ring-2 ring-purple-100 shadow-md">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.first_name || 'Supervisor'}
                </p>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-purple-600" />
                  <p className="text-xs text-slate-500 capitalize">
                    {user?.role || 'Supervisor'}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.first_name} {user?.last_name || 'Supervisor'}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || 'No email'}
                </p>
                <div className="flex items-center space-x-1 mt-2">
                  <Shield className="h-3 w-3 text-purple-600" />
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {user?.role || 'Supervisor'}
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-slate-50">
              <Activity className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-50">
              <Users className="mr-2 h-4 w-4" />
              <span>Team Management</span>
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