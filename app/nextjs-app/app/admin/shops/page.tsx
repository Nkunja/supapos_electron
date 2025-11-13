'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Edit, 
  Trash2, 
  RefreshCw, 
  Store, 
  Plus, 
  Save,
  MapPin,
  Phone,
  User,
  Mail,
  Users,
  Building2,
  UserPlus,
  ArrowRight,
  CreditCard,
  Mailbox,
  PhoneCall
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'react-toastify'
import { deleteShop, getShops, updateShop } from '@/app/api/shop'
import { getUsers } from '@/app/api/users'

interface Salesperson {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

interface Shop {
  id: number;
  name: string;
  address: string;
  po_box: string;
  phone_number: string;
  tel_number: string;
  kra_pin: string;
  is_active: boolean;
  salespersons: number[];
  salespersons_data: Salesperson[];
  salesperson_names: string;
  salespersons_count: number;
  created_at: string;
  updated_at: string;
}

interface ShopsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shop[];
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null)
  const [shopToEdit, setShopToEdit] = useState<Shop | null>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    po_box: '',
    phone_number: '',
    tel_number: '',
    kra_pin: '',
    is_active: true
  })
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchShops = async () => {
    try {
      setLoading(true)
      const data: ShopsResponse = await getShops()
      if (Array.isArray(data)) {
        setShops(data)
      } else if (data.results) {
        setShops(data.results)
      } else {
        setShops([])
      }
    } catch (error) {
      toast.error('Failed to fetch shops')
      setShops([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      if (Array.isArray(data)) {
        setUsers(data.filter(user => user.role === 'salesperson'))
      } else if (data.results) {
        setUsers((data.results as User[]).filter((user: User) => user.role === 'salesperson'))
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchShops()
    fetchUsers()
  }, [])

  const openEditDialog = (shop: Shop) => {
    setShopToEdit(shop)
    setEditFormData({
      name: shop.name,
      address: shop.address,
      po_box: shop.po_box || '',
      phone_number: shop.phone_number || '',
      tel_number: shop.tel_number || '',
      kra_pin: shop.kra_pin || '',
      is_active: shop.is_active
    })
    setEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setEditDialogOpen(false)
    setShopToEdit(null)
    setEditFormData({
      name: '',
      address: '',
      po_box: '',
      phone_number: '',
      tel_number: '',
      kra_pin: '',
      is_active: true
    })
  }

  const validateForm = (): boolean => {
    if (!editFormData.name.trim()) {
      toast.error('Shop name is required')
      return false
    }
    if (!editFormData.address.trim()) {
      toast.error('Address is required')
      return false
    }
    
    // Validate KRA PIN format if provided
    if (editFormData.kra_pin.trim()) {
      const kraPin = editFormData.kra_pin.replace(/\s/g, '').toUpperCase()
      if (kraPin.length !== 11 || !kraPin.startsWith('P')) {
        toast.error('KRA PIN must be 11 characters long and start with P (e.g., P051234567M)')
        return false
      }
    }
    
    return true
  }

  const saveShop = async () => {
    if (!shopToEdit || !validateForm()) return

    try {
      setUpdating(true)
      const updateData = {
        ...editFormData,
        kra_pin: editFormData.kra_pin.trim().toUpperCase()
      }
      await updateShop(shopToEdit.id, updateData)
      toast.success('Shop updated successfully')
      closeEditDialog()
      fetchShops()
    } catch (error) {
      toast.error('Failed to update shop')
    } finally {
      setUpdating(false)
    }
  }

  const openDeleteDialog = (shop: Shop) => {
    setShopToDelete(shop)
    setDeleteDialogOpen(true)
  }

  const handleDeleteShop = async () => {
    if (!shopToDelete) return

    try {
      setDeleting(true)
      await deleteShop(shopToDelete.id)
      toast.success('Shop deleted successfully')
      setDeleteDialogOpen(false)
      setShopToDelete(null)
      fetchShops()
    } catch (error) {
      toast.error('Failed to delete shop')
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

  const ShopCard = ({ shop }: { shop: Shop }) => (
    <Card className="mb-4 lg:hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold text-base">{shop.name}</h3>
              <Badge variant={shop.is_active ? 'default' : 'secondary'} className="text-xs">
                {shop.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{shop.address}</span>
              </div>
              {shop.po_box && (
                <div className="flex items-center gap-2">
                  <Mailbox className="h-3 w-3" />
                  <span>P.O. Box {shop.po_box}</span>
                </div>
              )}
              {shop.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{shop.phone_number}</span>
                </div>
              )}
              {shop.tel_number && (
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-3 w-3" />
                  <span>{shop.tel_number}</span>
                </div>
              )}
              {shop.kra_pin && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3" />
                  <span>KRA: {shop.kra_pin}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>{shop.salespersons_count} Salesperson(s)</span>
              </div>
              {shop.salesperson_names && (
                <div className="flex items-start gap-2">
                  <User className="h-3 w-3 mt-0.5" />
                  <span>{shop.salesperson_names}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(shop)}
              className="p-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteDialog(shop)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Created: {formatDate(shop.created_at)}
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Shops Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage business shops and their assignments</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/shops/add">
              <Button className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-2">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden xs:inline">Add Shop</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </Link>
            <Button 
              onClick={fetchShops} 
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="h-5 w-5 text-blue-600" />
                Total Shops
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{shops.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All shops</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-green-600" />
                Active Shops
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">
                {shops.filter(s => s.is_active).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-purple-600" />
                Shops with Staff
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-purple-600">
                {shops.filter(s => s.salespersons_count > 0).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Have salespersons</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-orange-600" />
                With KRA PIN
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-orange-600">
                {shops.filter(s => s.kra_pin && s.kra_pin.trim()).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Have tax registration</p>
            </CardContent>
          </Card>
        </div>

        {/* Shops List */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">All Shops</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Loading shops...</p>
                </div>
              </div>
            ) : shops.length === 0 ? (
              <div className="text-center py-12">
                <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No shops found</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by adding your first shop</p>
                <Link href="/admin/shops/add">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Shop
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="lg:hidden p-4">
                  {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left p-4 font-semibold text-gray-900 w-[160px]">Shop Name</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[180px]">Address</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[120px]">Contact</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[100px]">KRA PIN</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[160px]">Salespersons</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[80px]">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-900 w-[120px]">Manage</th>
                          <th className="text-right p-4 font-semibold text-gray-900 w-[100px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shops.map((shop) => (
                          <tr key={shop.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-4 font-medium">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-blue-600" />
                                <div>
                                  <div className="font-medium">{shop.name}</div>
                                  {shop.po_box && (
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                      <Mailbox className="h-3 w-3" />
                                      P.O. Box {shop.po_box}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <div className="max-w-[160px] truncate" title={shop.address}>
                                  {shop.address}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {shop.phone_number && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <Phone className="h-3 w-3 text-gray-500" />
                                    <span className="truncate">{shop.phone_number}</span>
                                  </div>
                                )}
                                {shop.tel_number && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <PhoneCall className="h-3 w-3 text-gray-500" />
                                    <span className="truncate">{shop.tel_number}</span>
                                  </div>
                                )}
                                {!shop.phone_number && !shop.tel_number && (
                                  <span className="text-xs text-gray-400">No contact</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              {shop.kra_pin ? (
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3 text-green-600" />
                                  <span className="text-xs font-mono">{shop.kra_pin}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Not set</span>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <Badge variant="outline" className="text-xs">
                                    {shop.salespersons_count} assigned
                                  </Badge>
                                </div>
                                {shop.salesperson_names && (
                                  <div className="text-xs text-gray-600 max-w-[140px] truncate" title={shop.salesperson_names}>
                                    {shop.salesperson_names}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={shop.is_active ? 'default' : 'secondary'}>
                                {shop.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                                                      
                            <td className="p-4 text-sm">
                              <Link href={`/admin/shops/${shop.id}`}>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="bg-blue-400 text-white hover:translate-x-[5px] transition-transform flex items-center gap-1"
                                >
                                 Reports
                                  <ArrowRight className="w-3 h-3" />
                                </Button>
                              </Link>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex gap-1 justify-end">
                                <Link href={`/shops/${shop.id}/assign`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-700"
                                    title="Assign Salespersons"
                                  >
                                    <UserPlus className="h-3 w-3" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(shop)}
                                  className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700"
                                  title="Edit Shop"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeleteDialog(shop)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Delete Shop"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Shop Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update the shop information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name *</Label>
                <Input
                  id="name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter shop name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kra_pin">KRA PIN</Label>
                <Input
                  id="kra_pin"
                  value={editFormData.kra_pin}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, kra_pin: e.target.value }))}
                  placeholder="e.g., P051234567M"
                  maxLength={11}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <textarea
                id="address"
                value={editFormData.address}
                onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter shop address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[60px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="po_box">P.O. Box</Label>
                <Input
                  id="po_box"
                  value={editFormData.po_box}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, po_box: e.target.value }))}
                  placeholder="e.g., 12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editFormData.phone_number}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="e.g., +254 700 123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telephone</Label>
                <Input
                  id="tel"
                  value={editFormData.tel_number}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, tel_number: e.target.value }))}
                  placeholder="e.g., 020 1234567"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={editFormData.is_active}
                onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="active">Active Shop</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button onClick={saveShop} disabled={updating}>
              {updating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Delete Shop</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete <strong>{shopToDelete?.name}</strong>? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteShop}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-sm"
            >
              {deleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Shop'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}