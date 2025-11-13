import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

interface SummaryCardProps {
  totalProducts: number;
}

export function SummaryCard({ totalProducts }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <Package className="w-8 h-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  );
}
