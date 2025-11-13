'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getShops } from '@/app/api/shop';
import {
    ArrowLeft,
    Building2,
    Calendar,
    RefreshCw,
    Store
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { getCompleteShopReport } from '@/app/api/shop-reports';
import { Shop } from '@/types/shop';
import { CompleteShopReport } from '@/types/shop-reports';
import Alerts from './alerts';
import Financial from './finance';
import Inventory from './inventory';
import Overview from './overview';
import Products from './products';
import Sales from './sales';
import Staff from './staff';




export default function ShopReportsPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.id as string;

  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<CompleteShopReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [days, setDays] = useState(30);


  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    if (shopId && !isNaN(Number(shopId))) {
      setSelectedShopId(Number(shopId));
    } else if (shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0].id);
    }
  }, [shopId, shops]);

  
  useEffect(() => {
    if (selectedShopId) {
      fetchShopReport(selectedShopId);
    }
  }, [selectedShopId, days]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const data = await getShops();
      if (Array.isArray(data)) {
        setShops(data.filter(shop => shop.is_active));
      } else if (data.results) {
        setShops(data.results.filter((shop: Shop) => shop.is_active));
      }
    } catch (error) {
      toast.error('Failed to fetch shops');
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopReport = async (shopId: number) => {
    try {
      setReportLoading(true);
      const report = await getCompleteShopReport(shopId, days);
      setReportData(report);
    } catch (error) {
      toast.error('Failed to fetch shop report');
      setReportData(null);
    } finally {
      setReportLoading(false);
    }
  };

  const handleShopChange = (shopIdStr: string) => {
    const newShopId = Number(shopIdStr);
    setSelectedShopId(newShopId);
    router.push(`/admin/shops/${newShopId}`);
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const selectedShop = shops.find(shop => shop.id === selectedShopId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/shops">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shops
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Shop Analytics</h1>
            <p className="text-sm text-muted-foreground">Comprehensive performance and inventory reports</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Days Filter */}
          <Select value={days.toString()} onValueChange={(value) => setDays(Number(value))}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={selectedShopId?.toString() || ''} 
            onValueChange={handleShopChange}
          >
            <SelectTrigger className="w-64">
              <Store className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select shop" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{shop.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {shop.salespersons_count} staff
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={() => selectedShopId && fetchShopReport(selectedShopId)}
            disabled={reportLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${reportLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Shop Info Card */}
      {selectedShop && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">{selectedShop.name}</h2>
                  <Badge variant={selectedShop.is_active ? 'default' : 'secondary'}>
                    {selectedShop.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{selectedShop.address}</p>
                <p>{selectedShop.phone_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {reportLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading shop analytics...</p>
          </div>
        </div>
      ) : reportData ? (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Overview 
              reportData={reportData} 
              formatCurrency={formatCurrency} 
            />
          </TabsContent>

          <TabsContent value="sales">
            <Sales 
              reportData={reportData} 
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <Inventory 
              reportData={reportData} 
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="financial">
            <Financial 
              reportData={reportData} 
              formatCurrency={formatCurrency}
            />
          </TabsContent>

          <TabsContent value="products">
            <Products 
              reportData={reportData} 
              formatCurrency={formatCurrency}
              days={days}
            />
          </TabsContent>

          <TabsContent value="staff">
            <Staff 
              reportData={reportData} 
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <Alerts 
              reportData={reportData} 
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600">Select a shop to view analytics</p>
          </div>
        </div>
      )}
    </div>
  );
}