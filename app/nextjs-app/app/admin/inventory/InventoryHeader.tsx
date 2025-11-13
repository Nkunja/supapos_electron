import React from "react";

const InventoryHeader: React.FC = () => {
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">
        Inventory Management
      </h1>
      <p className="text-gray-600 text-sm md:text-base">
        Manage your business inventory and stock levels
      </p>
    </div>
  );
};

export default InventoryHeader;
