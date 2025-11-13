import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { CompleteShopReport } from '@/types/shop-reports';

interface AlertsProps {
  reportData: CompleteShopReport;
  formatDate: (dateString: string) => string;
}

export default function Alerts({ reportData, formatDate }: AlertsProps) {
  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'expired':
      case 'out_of_stock':
        return <AlertTriangle className="h-4 w-4" />;
      case 'expiry_warning':
        return <Clock className="h-4 w-4" />;
      case 'low_stock':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reportData.alerts_detail.summary.critical_alerts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              High
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reportData.alerts_detail.summary.high_alerts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-yellow-600" />
              Medium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reportData.alerts_detail.summary.medium_alerts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.alerts_detail.summary.total_alerts}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Critical & High Priority Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reportData.alerts_detail.alerts
                .filter(alert => alert.priority === 'critical' || alert.priority === 'high')
                .slice(0, 10)
                .map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getAlertIcon(alert.alert_type)}
                        <span className="font-medium text-sm">{alert.product.name}</span>
                        <Badge variant="outline" className={`text-xs ${
                          alert.priority === 'critical' ? 'border-red-600 text-red-600' :
                          'border-orange-600 text-orange-600'
                        }`}>
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>Units: {alert.inventory.units_available}</span>
                        {alert.inventory.expiry_date && (
                          <span>Expires: {formatDate(alert.inventory.expiry_date)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {reportData.alerts_detail.alerts.filter(alert => 
                alert.priority === 'critical' || alert.priority === 'high'
              ).length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No critical or high priority alerts</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medium Priority Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reportData.alerts_detail.alerts
                .filter(alert => alert.priority === 'medium')
                .slice(0, 10)
                .map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getAlertIcon(alert.alert_type)}
                        <span className="font-medium text-sm">{alert.product.name}</span>
                        <Badge variant="outline" className="text-xs border-yellow-600 text-yellow-600">
                          {alert.priority}
                        </Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                        <span>Units: {alert.inventory.units_available}</span>
                        {alert.inventory.expiry_date && (
                          <span>Expires: {formatDate(alert.inventory.expiry_date)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {reportData.alerts_detail.alerts.filter(alert => 
                alert.priority === 'medium'
              ).length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No medium priority alerts</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reportData.alerts_detail.alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getAlertIcon(alert.alert_type)}
                      <span className="font-medium text-sm">{alert.product.name}</span>
                      <Badge variant="outline" className={`text-xs ${
                        alert.priority === 'critical' ? 'border-red-600 text-red-600' :
                        alert.priority === 'high' ? 'border-orange-600 text-orange-600' :
                        alert.priority === 'medium' ? 'border-yellow-600 text-yellow-600' :
                        'border-blue-600 text-blue-600'
                      }`}>
                        {alert.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {alert.alert_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span>Units: {alert.inventory.units_available}</span>
                      {alert.inventory.expiry_date && (
                        <span>Expires: {formatDate(alert.inventory.expiry_date)}</span>
                      )}
                      {alert.inventory.batch_number && (
                        <span>Batch: {alert.inventory.batch_number}</span>
                      )}
                   
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {formatDate(alert.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {reportData.alerts_detail.alerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <p className="text-lg font-medium text-green-600">All Clear!</p>
                <p className="text-sm text-gray-500">No active alerts for this shop</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}