'use client'

import { deleteUser, getUsers, updateUser } from '@/app/api/users'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, Edit, Mail, Phone, RefreshCw, Shield, Trash2, UserPlus, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: string
  phone_number: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  assigned_shop: string
  created_at: string
  updated_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    phone_number: '',
    is_active: true,
    is_staff: false
  })
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsers()
      if (Array.isArray(data)) {
        setUsers(data)
      } else if (data.results) {
        setUsers(data.results)
      } else {
        setUsers([])
      }

    } catch (error) {
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number,
      is_active: user.is_active,
      is_staff: user.is_staff
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      setUpdating(true)
      await updateUser(selectedUser.id, editFormData)
      toast.success('User updated successfully')
      setEditDialogOpen(false)
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setDeleting(true)
      await deleteUser(userToDelete.id)
      toast.success('User deleted successfully')
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'salesperson':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const UserCard = ({ user }: { user: User }) => (
    <Card className="mb-4 lg:hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-base">{user.full_name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                {user.role}
              </Badge>
              <Badge variant={user.is_active ? 'default' : 'secondary'} className="text-xs">
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {user.is_staff && (
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Staff
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(user)}
              className="p-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(user)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{user.phone_number}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined {formatDate(user.date_joined)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage system users and their permissions</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/users/add">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2">
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Create User</span>
                <span className="xs:hidden">Create</span>
              </Button>
            </Link>
            <Button 
              onClick={fetchUsers} 
              disabled={loading} 
              variant="outline" 
              className="text-sm px-3 py-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                System users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-green-600" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="h-5 w-5 text-purple-600" />
                Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(users.map(u => u.role))).map(role => (
                  <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                    {role} ({users.filter(u => u.role === role).length})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Loading users...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by creating your first user</p>
                <Link href="/admin/users/add">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="lg:hidden p-2">
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>

  
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead className="w-[250px]">Email</TableHead>
                          <TableHead className="w-[120px]">Role</TableHead>
                          <TableHead className="w-[150px]">Phone</TableHead>
                          <TableHead className="w-[120px]">Status</TableHead>
                          <TableHead className="w-[180px]">Date Joined</TableHead>
                          <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div>
                                <div className="font-semibold">{user.full_name}</div>
                                {user.is_staff && (
                                  <Badge variant="outline" className="text-xs mt-1">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Staff
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {user.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.phone_number ? (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {user.phone_number}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not provided</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {formatDate(user.date_joined)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(user)}
                                  className="p-2 hover:bg-blue-50 hover:text-blue-700"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteDialog(user)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md lg:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit User</DialogTitle>
            <DialogDescription className="text-sm">
              Make changes to the user information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                <Input
                  id="first_name"
                  value={editFormData.first_name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="last_name"
                  value={editFormData.last_name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone_number"
                value={editFormData.phone_number}
                onChange={(e) => setEditFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                className="text-sm"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Select
                value={editFormData.role}
                onValueChange={(value) => setEditFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="salesperson">Salesperson</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm font-medium">Active Status</Label>
                <p className="text-xs text-muted-foreground">User can log in and access the system</p>
              </div>
              <Switch
                id="is_active"
                checked={editFormData.is_active}
                onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="is_staff" className="text-sm font-medium">Staff Member</Label>
                <p className="text-xs text-muted-foreground">User has administrative privileges</p>
              </div>
              <Switch
                id="is_staff"
                checked={editFormData.is_staff}
                onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, is_staff: checked }))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateUser}
              disabled={updating}
              className="text-sm bg-blue-600 hover:bg-blue-700"
            >
              {updating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete <strong>{userToDelete?.full_name}</strong>? 
              This action cannot be undone and will permanently remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              {deleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}