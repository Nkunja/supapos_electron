'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { 
  Store,
  MapPin,
  Phone,
  Users,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Building2,
  User,
  Mail,
  Plus,
  CreditCard,
  Mailbox,
  PhoneCall
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { createShop } from '@/app/api/shop';
import { getUsers } from '@/app/api/users';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

interface ShopFormData {
  name: string;
  address: string;
  po_box: string;
  phone_number: string;
  tel_number: string;
  kra_pin: string;
  salespersons: number[];
  is_active: boolean;
}

export default function AddShopPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    address: '',
    po_box: '',
    phone_number: '',
    tel_number: '',
    kra_pin: '',
    salespersons: [],
    is_active: true
  });

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getUsers();
      let salespeople: User[] = [];
      
      if (Array.isArray(data)) {
        salespeople = data.filter(user => user.role === 'salesperson' && user.is_active);
      } else if (data.results) {
        salespeople = (data.results as User[]).filter((user: User) => user.role === 'salesperson' && user.is_active);
      }
      
      setUsers(salespeople);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load salespersons');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (field: keyof ShopFormData, value: string | boolean | number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSalespersonToggle = (salespersonId: number, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      salespersons: checked 
        ? [...prev.salespersons, salespersonId]
        : prev.salespersons.filter(id => id !== salespersonId)
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const selectAllSalespersons = () => {
    setFormData(prev => ({
      ...prev,
      salespersons: users.map(user => user.id)
    }));
  };

  const clearAllSalespersons = () => {
    setFormData(prev => ({
      ...prev,
      salespersons: []
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Shop name is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    
    // Validate KRA PIN format if provided
    if (formData.kra_pin.trim()) {
      const kraPin = formData.kra_pin.replace(/\s/g, '').toUpperCase();
      if (kraPin.length !== 11 || !kraPin.startsWith('P')) {
        setError('KRA PIN must be 11 characters long and start with P (e.g., P051234567M)');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const shopData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        po_box: formData.po_box.trim() || '',
        phone_number: formData.phone_number.trim() || '',
        tel_number: formData.tel_number.trim() || '',
        kra_pin: formData.kra_pin.trim().toUpperCase() || '',
        salespersons: formData.salespersons,
        is_active: formData.is_active
      };

      await createShop(shopData);
      
      setSuccess(`Shop "${formData.name}" created successfully!`);
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        po_box: '',
        phone_number: '',
        tel_number: '',
        kra_pin: '',
        salespersons: [],
        is_active: true
      });

      // Redirect after success
      setTimeout(() => {
        router.push('/admin/shops');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/shops');
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/shops">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shops
          </Button>
        </Link>
      </div>

      <div className="w-full mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Add New Shop</span>
            </CardTitle>
            <CardDescription>
              Create a new business shop and assign salespersons to manage it
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Alerts */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Shop Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Shop Information</h3>
                  <p className="text-sm text-gray-600">Basic details about the shop</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Shop Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter shop name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kra_pin" className="text-sm font-medium">
                      KRA PIN
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="kra_pin"
                        type="text"
                        placeholder="e.g., P051234567M"
                        value={formData.kra_pin}
                        onChange={(e) => handleInputChange('kra_pin', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                        maxLength={11}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Kenya Revenue Authority PIN (optional)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="address"
                      placeholder="Enter complete shop address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="po_box" className="text-sm font-medium">
                      P.O. Box
                    </Label>
                    <div className="relative">
                      <Mailbox className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="po_box"
                        type="text"
                        placeholder="e.g., 12345"
                        value={formData.po_box}
                        onChange={(e) => handleInputChange('po_box', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="e.g., +254 700 123456"
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tel_number" className="text-sm font-medium">
                      Telephone Number
                    </Label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="tel_number"
                        type="tel"
                        placeholder="e.g., 020 1234567"
                        value={formData.tel_number}
                        onChange={(e) => handleInputChange('tel_number', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    disabled={loading}
                  />
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    Active Shop
                  </Label>
                  <span className="text-xs text-gray-500 ml-2">
                    (Shop will be available for operations)
                  </span>
                </div>
              </div>

              {/* Salesperson Assignment Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Assign Salespersons</h3>
                  <p className="text-sm text-gray-600">Select salespersons to manage this shop</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Salesperson Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Available Salespersons ({users.length})
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllSalespersons}
                          disabled={loading || loadingUsers || users.length === 0}
                          className="text-xs"
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearAllSalespersons}
                          disabled={loading || formData.salespersons.length === 0}
                          className="text-xs"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>

                    <Card className="border-gray-200">
                      <ScrollArea className="h-[300px] p-4">
                        {loadingUsers ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-sm text-gray-500">Loading salespersons...</p>
                          </div>
                        ) : users.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm text-gray-500">No active salespersons available</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {users.map((user) => (
                              <div key={user.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                <Checkbox
                                  id={`salesperson-${user.id}`}
                                  checked={formData.salespersons.includes(user.id)}
                                  onCheckedChange={(checked) => handleSalespersonToggle(user.id, checked as boolean)}
                                  disabled={loading}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <Label
                                      htmlFor={`salesperson-${user.id}`}
                                      className="text-sm font-medium cursor-pointer"
                                    >
                                      {user.full_name}
                                    </Label>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </Card>
                  </div>

                  {/* Selected Salespersons Summary */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Selected Salespersons ({formData.salespersons.length})
                    </Label>
                    
                    <Card className="border-gray-200">
                      <div className="p-4">
                        {formData.salespersons.length === 0 ? (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm text-gray-500">No salespersons selected</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Select from the list to assign salespersons to this shop
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-700">
                                {formData.salespersons.length} salesperson(s) selected
                              </span>
                            </div>
                            <Separator />
                            <ScrollArea className="max-h-[240px]">
                              <div className="space-y-2">
                                {users
                                  .filter(user => formData.salespersons.includes(user.id))
                                  .map((user) => (
                                    <div key={user.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                                      <User className="h-3 w-3 text-blue-600" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-900">{user.full_name}</p>
                                        <p className="text-xs text-blue-600">{user.email}</p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleSalespersonToggle(user.id, false)}
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                        disabled={loading}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  ))}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="button"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Shop...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Shop
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}