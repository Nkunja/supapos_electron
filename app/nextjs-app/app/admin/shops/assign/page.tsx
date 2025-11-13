'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft,
  Save,
  RefreshCw,
  Store,
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  UserCheck,
  UserX,
  ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-toastify'
import { assignSalesperson, removeSalesperson, getShopById, getShops, getShopSalespersons, AssignSalespersonData, RemoveSalespersonData } from '@/app/api/shop'
import { getUsers, User } from '@/app/api/users'
import { Shop, Salesperson} from '@/types/shop'

export default function ShopSalespersonManagementPage() {
  const router = useRouter()

  const [allShops, setAllShops] = useState<Shop[]>([])
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [assignedSalespersons, setAssignedSalespersons] = useState<Salesperson[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [shopSearchTerm, setShopSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingShopDetails, setLoadingShopDetails] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedShopId) {
      fetchShopDetails()
    } else {
      setSelectedShop(null)
      setAssignedSalespersons([])
      setSelectedUsers([])
    }
  }, [selectedShopId])


  useEffect(() => {
    if (allUsers.length > 0 && assignedSalespersons.length >= 0) {
      const assignedIds = assignedSalespersons.map(sp => sp.id)
      const available = allUsers.filter(user => !assignedIds.includes(user.id))
      setAvailableUsers(available)
    } else {
      setAvailableUsers(allUsers)
    }
  }, [assignedSalespersons, allUsers])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchShops(), fetchUsers()])
    } catch (error) {
      toast.error('Failed to load initial data')
    } finally {
      setLoading(false)
    }
  }

  const fetchShops = async () => {
    try {
      const shopsData = await getShops()
      let shopsList: Shop[] = []
      
      if (Array.isArray(shopsData)) {
        shopsList = shopsData
      } else if (shopsData.results) {
        shopsList = shopsData.results
      }
      
      setAllShops(shopsList)
    } catch (error) {
      console.error('Error fetching shops:', error)
      toast.error('Failed to fetch shops')
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      let salespeople: User[] = []
      
      if (Array.isArray(data)) {
        salespeople = data.filter(user => user.role === 'salesperson' && user.is_active)
      } else if (data.results) {
        salespeople = data.results.filter((user: { role: string; is_active: any }) => user.role === 'salesperson' && user.is_active)
      }
      
      setAllUsers(salespeople)
    } catch (error) {
      toast.error('Failed to fetch salespersons')
    }
  }

  const fetchShopDetails = async () => {
    if (!selectedShopId) return

    try {
      setLoadingShopDetails(true)
      
      // Fetch shop details and salespersons list
      const [shopData, salespersonsData] = await Promise.all([
        getShopById(selectedShopId),
        getShopSalespersons(selectedShopId)
      ])
      
      setSelectedShop(shopData)
      setAssignedSalespersons(salespersonsData.salespersons || [])
      setSelectedUsers([])
      
    } catch (error) {
      toast.error('Failed to fetch shop details')
      setSelectedShop(null)
      setAssignedSalespersons([])
    } finally {
      setLoadingShopDetails(false)
    }
  }

  const filteredShops = allShops.filter(shop =>
    shop.name.toLowerCase().includes(shopSearchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(shopSearchTerm.toLowerCase())
  )

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleShopSelect = (shopId: string) => {
    setSelectedShopId(Number(shopId))
  }

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const selectAllUsers = () => {
    setSelectedUsers(filteredAvailableUsers.map(user => user.id))
  }

  const clearAllSelections = () => {
    setSelectedUsers([])
  }

  const handleAssignSalespersons = async () => {
    if (!selectedShop || selectedUsers.length === 0) {
      toast.error('Please select at least one salesperson to assign')
      return
    }

    try {
      setUpdating(true)
      
      // Assign each selected user
      const assignmentPromises = selectedUsers.map(async (userId) => {
        const assignmentData: AssignSalespersonData = {
          salesperson_id: userId
        }
        return await assignSalesperson(selectedShop.id, assignmentData)
      })

      const results = await Promise.allSettled(assignmentPromises)
      
      // Check results
      const successful = results.filter(result => result.status === 'fulfilled').length
      const failed = results.filter(result => result.status === 'rejected').length
      
      if (successful > 0) {
        toast.success(`Successfully assigned ${successful} salesperson(s) to ${selectedShop.name}`)
      }
      
      if (failed > 0) {
        toast.error(`Failed to assign ${failed} salesperson(s). They may already be assigned to another shop.`)
      }
      
      // Clear selections and refresh data
      setSelectedUsers([])
      await fetchShopDetails()
      
    } catch (error) {
      console.error('Error assigning salespersons:', error)
      toast.error('Failed to assign salespersons')
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveSalesperson = async (salespersonId: number, salespersonName: string) => {
    if (!selectedShop) return

    try {
      setUpdating(true)
      
      const removalData: RemoveSalespersonData = {
        salesperson_id: salespersonId
      }
      
      await removeSalesperson(selectedShop.id, removalData)
      
      toast.success(`Successfully removed ${salespersonName} from ${selectedShop.name}`)
      
      // Refresh data
      await fetchShopDetails()
      
    } catch (error) {
      console.error('Error removing salesperson:', error)
      toast.error('Failed to remove salesperson')
    } finally {
      setUpdating(false)
    }
  }


  const getShopInitials = (shop: Shop) => {
    return shop.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-sm text-muted-foreground">Loading shops and salespersons...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/shops">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shops
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage Salespersons</h1>
              <p className="text-sm text-muted-foreground">Select a shop and manage its salesperson assignments</p>
            </div>
          </div>
        </div>

        {/* Shop Selection */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-600" />
              Select Shop
            </CardTitle>
            <CardDescription>
              Choose a shop to manage its salesperson assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Shop Search and Select */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search shops by name or address..."
                      value={shopSearchTerm}
                      onChange={(e) => setShopSearchTerm(e.target.value)}
                      className="pl-10 max-w-[100px]"
                      disabled
                    />
                  </div>
                </div>
                <Select onValueChange={handleShopSelect} value={selectedShopId?.toString() || ""}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredShops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {getShopInitials(shop)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{shop.name}</span>
                          <Badge variant={shop.is_active ? 'default' : 'secondary'} className="text-xs ml-2">
                            {shop.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Shop Display */}
              {selectedShop && (
                <div className="p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getShopInitials(selectedShop)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{selectedShop.name}</h3>
                        <Badge variant={selectedShop.is_active ? 'default' : 'secondary'}>
                          {selectedShop.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedShop.address}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedShop.phone_number}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {assignedSalespersons.length} salesperson(s)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Management Section - Only show when shop is selected */}
        {selectedShop && (
          <>
            {loadingShopDetails ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Loading shop details...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Assignments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-green-600" />
                      Assigned Salespersons ({assignedSalespersons.length})
                    </CardTitle>
                    <CardDescription>
                      Currently assigned to {selectedShop.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {assignedSalespersons.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">No salespersons assigned</h3>
                        <p className="text-sm text-muted-foreground">Select available salespersons to assign them</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {assignedSalespersons.map((salesperson) => (
                          <div
                            key={salesperson.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex items-center gap-3">
                         
                              <div>
                                <p className="font-medium">{salesperson.first_name}</p>
                                <p className="text-sm text-muted-foreground">{salesperson.email}</p>
                                {salesperson.first_name && (
                                  <p className="text-xs text-muted-foreground">{salesperson.first_name}</p>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveSalesperson(salesperson.id, salesperson.first_name)}
                              disabled={updating}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <UserMinus className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Available Salespersons */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-blue-600" />
                          Available Salespersons
                        </CardTitle>
                        <CardDescription>
                          Select salespersons to assign to {selectedShop.name}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllUsers}
                          disabled={filteredAvailableUsers.length === 0}
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllSelections}
                          disabled={selectedUsers.length === 0}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search available salespersons..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                        {searchTerm && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Available Users List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredAvailableUsers.length === 0 ? (
                        <div className="text-center py-8">
                          <UserX className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                          <h3 className="text-lg font-semibold mb-2">No available salespersons</h3>
                          <p className="text-sm text-muted-foreground">
                            {searchTerm 
                              ? 'Try adjusting your search terms' 
                              : 'All active salespersons are already assigned to shops'}
                          </p>
                        </div>
                      ) : (
                        filteredAvailableUsers.map((user) => (
                          <div
                            key={user.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                              selectedUsers.includes(user.id) 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white border-gray-200'
                            }`}
                            onClick={() => handleUserToggle(user.id)}
                          >
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => handleUserToggle(user.id)}
                            />
                            
                          
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{user.first_name}</h4>
                                {selectedUsers.includes(user.id) && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                                {user.phone_number && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {user.phone_number}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Assignment Action */}
                    {selectedUsers.length > 0 && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                              {selectedUsers.length} salesperson{selectedUsers.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                          
                          <Button
                            onClick={handleAssignSalespersons}
                            disabled={updating || selectedUsers.length === 0}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {updating ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Assign {selectedUsers.length} Salesperson{selectedUsers.length !== 1 ? 's' : ''}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Assigned</p>
                      <p className="text-2xl font-bold text-blue-900">{assignedSalespersons.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Available</p>
                      <p className="text-2xl font-bold text-green-900">{availableUsers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">Selected</p>
                      <p className="text-2xl font-bold text-purple-900">{selectedUsers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* No Shop Selected State */}
        {!selectedShop && !loading && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Select a Shop to Get Started</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a shop from the dropdown above to view and manage its salesperson assignments
                </p>
                <div className="text-sm text-muted-foreground">
                  Available shops: <strong>{allShops.length}</strong> | 
                  Available salespersons: <strong>{allUsers.length}</strong>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}