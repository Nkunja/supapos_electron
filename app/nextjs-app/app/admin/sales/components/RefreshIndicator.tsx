import { RefreshCw } from "lucide-react";

interface RefreshIndicatorProps {
  lastRefresh: Date;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  lastRefresh,
  onRefresh,
  isRefreshing,
}) => {
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <span>Last updated: {formatTimeAgo(lastRefresh)}</span>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
          isRefreshing
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
        title="Refresh data"
      >
        <RefreshCw
          className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
      </button>
    </div>
  );
};