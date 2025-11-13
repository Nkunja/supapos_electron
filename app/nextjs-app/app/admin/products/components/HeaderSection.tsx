import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

interface HeaderSectionProps {
  totalProducts: number;
  loading: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
}

export function HeaderSection({
  totalProducts,
  loading,
  onRefresh,
  onAddProduct,
}: HeaderSectionProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Products Catalog</h2>
        <p className="text-gray-600">{totalProducts} total products</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          onClick={onAddProduct}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
