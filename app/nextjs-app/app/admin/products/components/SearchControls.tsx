import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, FileDown } from "lucide-react";

interface SearchControlsProps {
  searchQuery: string;
  onSearch: (value: string) => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export function SearchControls({
  searchQuery,
  onSearch,
  onExportCSV,
  onExportPDF,
}: SearchControlsProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, generic name, or description..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onExportCSV}
              className="flex items-center gap-2 flex-1"
            >
              <FileText className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={onExportPDF}
              className="flex items-center gap-2 flex-1"
            >
              <FileDown className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
