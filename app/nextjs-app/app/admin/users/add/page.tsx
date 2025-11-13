'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Shield,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { register } from '@/app/api/users/register';

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'supervisor' | 'salesperson';
  password: string;
  confirm_password: string;
}

export default function AddUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'salesperson',
    password: '',
    confirm_password: ''
  });

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password
      };

      const result = await register(userData);

      setSuccess(result.message);
      
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'salesperson',
        password: '',
        confirm_password: ''
      });

      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'salesperson',
      password: '',
      confirm_password: ''
    });
    setError('');
    setSuccess('');
    router.push('/admin/users');
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full system access and user management';
      case 'supervisor':
        return 'Can oversee operations and generate reports';
      case 'salesperson':
        return 'Can process sales and manage assigned shop inventory';
      default:
        return '';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />;
      case 'supervisor':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'salesperson':
        return <User className="h-4 w-4 text-green-600" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Add New User</span>
            </CardTitle>
            <CardDescription>
              Create a new user account with appropriate role and permissions
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Basic details about the user</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="Enter first name"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Enter last name"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  <p className="text-sm text-gray-600">How we can reach this user</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This will be used for login and notifications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number (Optional)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">User Role & Permissions</h3>
                  <p className="text-sm text-gray-600">Define what this user can access</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    User Role *
                  </Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: any) => handleInputChange('role', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="h-12">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(formData.role)}
                        <SelectValue placeholder="Select user role" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesperson">
                        <div className="flex items-center space-x-3 py-2">
                          <User className="h-4 w-4 text-green-600" />
                          <div className="flex flex-col">
                            <span className="font-medium">Salesperson</span>
                            <span className="text-xs text-gray-500">Process sales and manage shop inventory</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="supervisor">
                        <div className="flex items-center space-x-3 py-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <div className="flex flex-col">
                            <span className="font-medium">Supervisor</span>
                            <span className="text-xs text-gray-500">Oversee operations and generate reports</span>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-3 py-2">
                          <Shield className="h-4 w-4 text-red-600" />
                          <div className="flex flex-col">
                            <span className="font-medium">Administrator</span>
                            <span className="text-xs text-gray-500">Full system access and user management</span>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Role Description */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(formData.role)}
                      <span className="text-sm font-medium capitalize">{formData.role}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {getRoleDescription(formData.role)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-medium text-gray-900">Security</h3>
                  <p className="text-sm text-gray-600">Set up login credentials</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password" className="text-sm font-medium">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirm_password}
                        onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                        className="pl-10 pr-10"
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating User...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
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
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}