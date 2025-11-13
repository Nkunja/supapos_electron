import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalCount,
  hasPrevious,
  hasNext,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * 10 + 1} to{" "}
        {Math.min(currentPage * 10, totalCount)} of {totalCount} results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        <span className="text-sm text-gray-600 px-3">Page {currentPage}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
