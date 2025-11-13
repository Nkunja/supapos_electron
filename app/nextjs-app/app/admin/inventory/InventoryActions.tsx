import React from "react";
import { Download, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
interface InventoryActionsProps {
  onDownload: (type: "all" | "low_stock" | "out_of_stock") => void;
  loading: boolean;
  onAddOpen: () => void;
}

const InventoryActions: React.FC<InventoryActionsProps> = ({
  onDownload,
  loading,
  onAddOpen,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => onDownload("low_stock")}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        {loading ? "Downloading..." : "Low Stock"}
      </Button>
      <Button
        onClick={() => onDownload("all")}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        {loading ? "Downloading..." : "Full Report"}
      </Button>
      <Button
        onClick={() => onDownload("out_of_stock")}
        disabled={loading}
        className="text-red-700 bg-red-50 hover:bg-red-100 border-red-300"
        size="sm"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        {loading ? "Downloading..." : "Out of Stock"}
      </Button>
    </div>
  );
};

export default InventoryActions;
