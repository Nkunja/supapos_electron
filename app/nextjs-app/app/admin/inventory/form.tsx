"use client";

import {
  createInventory,
  getDrugTypes,
  getUnits,
  Inventory,
  InventoryCreateRequest,
  updateInventory
} from "@/app/api/inventory";
import { getProducts } from "@/app/api/products";
import { getPurchaseOrders } from "@/app/api/purchase-orders";
import { getShops } from "@/app/api/shop";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertTriangle,
  Calculator,
  Calendar,
  CheckCircle,
  FileText,
  Loader2,
  Package,
  Save,
  ShoppingCart,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


import { InventoryFormData, Product } from "@/types/inventory/inventory";
import { PurchaseOrder } from "@/types/purchase-orders";
import { Shop } from "@/types/shop";


interface AddInventoryFormProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEmbedded?: boolean;
  inventory?: Inventory | null;
}

const initialFormData: InventoryFormData = {
  purchase_order: null,
  product: 0,
  shop: 0,
  batch_number: "",
  barcode: "",
  expiry_date: "",
  purchase_date: new Date().toISOString().split('T')[0],
  user_type: "both",
  drug_type: "otc",
  form: "tablet",
  pieces_per_unit: 1,
  unit_of_measurement: "pieces",
  total_units: 1,
  product_description: "",
  buying_price_per_unit: 0,
  cost_price_per_piece: 0,
  selling_price_per_piece: 0,
  reorder_level: 10,
  is_active: true,
};

export function AddInventoryForm({
  isOpen = true,
  onClose,
  onSuccess,
  isEmbedded = false,
  inventory = null,
}: AddInventoryFormProps) {
  const [formData, setFormData] = useState<InventoryFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [calculatedSellingPrice, setCalculatedSellingPrice] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [drugTypes, setDrugTypes] = useState<{ value: string; label: string }[]>([]);
  const [units, setUnits] = useState<{ value: string; label: string }[]>([]);
  
  const [productsLoading, setProductsLoading] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [purchaseOrdersLoading, setPurchaseOrdersLoading] = useState(false);
  const [choicesLoading, setChoicesLoading] = useState(false);

  // Product search states
  const [productSearchOpen, setProductSearchOpen] = useState(false);
  const [productSearchValue, setProductSearchValue] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadChoices();
      loadProducts();
      loadShops();
      loadPurchaseOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (inventory && products.length > 0) {
      setFormData({
        purchase_order: inventory.purchase_order || null,
        product: inventory.product,
        shop: inventory.shop || 0,
        batch_number: inventory.batch_number,
        barcode: inventory.barcode || "",
        expiry_date: inventory.expiry_date || "",
        purchase_date: inventory.purchase_date || new Date().toISOString().split('T')[0],
        user_type: inventory.user_type,
        drug_type: inventory.drug_type,
        form: inventory.form,
        pieces_per_unit: inventory.pieces_per_unit || 1,
        unit_of_measurement: inventory.unit_of_measurement,
        total_units: inventory.total_units || 1,
        product_description: inventory.product_description || "",
        buying_price_per_unit: (inventory.cost_price_per_piece * inventory.pieces_per_unit) || 0,
        cost_price_per_piece: inventory.cost_price_per_piece || 0,
        selling_price_per_piece: inventory.selling_price_per_piece || 0,
        reorder_level: inventory.reorder_level || 10,
        is_active: inventory.is_active !== false,
      });
      
      const product = products.find((p: Product) => p.id === inventory.product);
      if (product) {
        setSelectedProduct(product);
        setProductSearchValue(product.name + (product.generic_name ? ` (${product.generic_name})` : ""));
      }

      if (inventory.purchase_order && purchaseOrders.length > 0) {
        const purchaseOrder = purchaseOrders.find(po => po.id === inventory.purchase_order);
        if (purchaseOrder) {
          setSelectedPurchaseOrder(purchaseOrder);
        }
      }
    } else if (!inventory) {
      setFormData(initialFormData);
      setSelectedProduct(null);
      setSelectedPurchaseOrder(null);
      setProductSearchValue("");
      setProductSearchQuery("");
    }
  }, [inventory, products, purchaseOrders]);

  // Updated pricing logic with 1 decimal place for cost_price_per_piece
  useEffect(() => {
    if (formData.buying_price_per_unit > 0 && formData.pieces_per_unit > 0) {
      // Calculate cost_price_per_piece as buying_price_per_unit / pieces_per_unit, formatted to 1 decimal place
      const costPricePerPiece = Number((formData.buying_price_per_unit / formData.pieces_per_unit).toFixed(1));
      
      // Check if cost_price_per_piece has more than 10 digits
      if (costPricePerPiece.toString().replace('.', '').length > 10) {
        setError("Cost price per piece exceeds 10 digits");
        return;
      }

      // Update cost_price_per_piece in formData
      setFormData(prev => ({
        ...prev,
        cost_price_per_piece: costPricePerPiece,
      }));

      // Calculate selling price with 30% markup, rounded to nearest 10
      const sellingPriceWithMarkup = costPricePerPiece * 1.3;
      const roundedSellingPrice = Math.round(sellingPriceWithMarkup / 10) * 10;
      setCalculatedSellingPrice(roundedSellingPrice);
    } else {
      setFormData(prev => ({
        ...prev,
        cost_price_per_piece: 0,
      }));
      setCalculatedSellingPrice(null);
    }
  }, [formData.buying_price_per_unit, formData.pieces_per_unit]);

  const loadChoices = async () => {
    setChoicesLoading(true);
    try {
      const [drugTypesData, unitsData] = await Promise.all([
        getDrugTypes(),
        getUnits(),
      ]);
      
      if (drugTypesData) setDrugTypes(drugTypesData);
      if (unitsData) setUnits(unitsData);
    } catch (error) {
      console.error("Failed to load choices:", error);
      toast.error("Failed to load form choices");
    } finally {
      setChoicesLoading(false);
    }
  };

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load products";
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadShops = async () => {
    setShopsLoading(true);
    try {
      const data = await getShops();
      setShops(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      toast.error("Failed to load shops");
      setShops([]);
    } finally {
      setShopsLoading(false);
    }
  };


const loadPurchaseOrders = async () => {
  setPurchaseOrdersLoading(true);
  try {
    const data = await getPurchaseOrders();
    
    let allOrders: PurchaseOrder[] = [];
    
    // Ensure data is an array and handle different response formats
    if (Array.isArray(data)) {
      allOrders = data;
    } else if (data && typeof data === 'object' && 'results' in data) {
      // Handle paginated response
      allOrders = (data as { results: PurchaseOrder[] }).results || [];
    } else {
      console.error("API returned unexpected data format:", data);
      allOrders = [];
      toast.error("Failed to load purchase orders: Invalid data format");
    }
    
    // Filter to show only completed or approved purchase orders
    const availableOrders = allOrders.filter((po: PurchaseOrder) => 
      ['completed', 'approved'].includes(po.status)
    );
    
    setPurchaseOrders(availableOrders);
  } catch (error) {
    console.error("Error loading purchase orders:", error);
    setPurchaseOrders([]);
    toast.error("Failed to load purchase orders");
  } finally {
    setPurchaseOrdersLoading(false);
  }
};

  const handleInputChange = (
    field: keyof InventoryFormData,
    value: string | number | boolean | null
  ) => {
    // Validate buying_price_per_unit for 10-digit limit
    if (field === "buying_price_per_unit") {
      const stringValue = value?.toString() || "";
      if (stringValue.replace('.', '').length > 10) {
        setError("Buying price per unit must not exceed 10 digits");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p: Product) => p.id.toString() === productId);
    if (product) {
      setSelectedProduct(product);
      setProductSearchValue(product.name + (product.generic_name ? ` (${product.generic_name})` : ""));
      setFormData(prev => ({
        ...prev,
        product: product.id,
      }));
      setProductSearchOpen(false);
    }
  };

  const handlePurchaseOrderSelect = (purchaseOrderId: string) => {
    if (purchaseOrderId === "none") {
      setSelectedPurchaseOrder(null);
      setFormData(prev => ({
        ...prev,
        purchase_order: null,
        shop: 0,
      }));
    } else {
      const purchaseOrder = purchaseOrders.find(po => po.id?.toString() === purchaseOrderId);
      if (purchaseOrder) {
        setSelectedPurchaseOrder(purchaseOrder);
        setFormData(prev => ({
          ...prev,
          purchase_order: purchaseOrder.id!,

          shop: typeof purchaseOrder.shop === 'number' ? purchaseOrder.shop : purchaseOrder.shop?.id || prev.shop,
        }));
      }
    }
  };

  // Filter products based on search query (separate from display value)
  const filteredProducts = products.filter((product: Product) => {
    if (!productSearchQuery) return true; // Show all products when no search query
    
    const searchTerm = productSearchQuery.toLowerCase().trim();
    if (!searchTerm) return true;
    
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      (product.generic_name && product.generic_name.toLowerCase().includes(searchTerm)) ||
      (product.description && product.description.toLowerCase().includes(searchTerm)) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm))
    );
  });

  const validateForm = (): boolean => {
    if (!formData.product || formData.product === 0) {
      setError("Product selection is required");
      return false;
    }
    if (!formData.shop || formData.shop === 0) {
      setError("Shop selection is required");
      return false;
    }
    if (!formData.batch_number.trim()) {
      setError("Batch number is required");
      return false;
    }
    if (formData.pieces_per_unit <= 0) {
      setError("Pieces per unit must be greater than 0");
      return false;
    }
    if (formData.total_units <= 0) {
      setError("Total units must be greater than 0");
      return false;
    }
    if (formData.buying_price_per_unit <= 0) {
      setError("Buying price per unit must be greater than 0");
      return false;
    }
    if (formData.cost_price_per_piece.toString().replace('.', '').length > 10) {
      setError("Cost price per piece must not exceed 10 digits");
      return false;
    }
    if (formData.selling_price_per_piece <= 0) {
      setError("Selling price per piece must be greater than 0");
      return false;
    }

    if (formData.expiry_date) {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        setError("Expiry date must be in the future");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submissionData: InventoryCreateRequest = {
        purchase_order: formData.purchase_order || undefined,
        product: formData.product,
        shop: formData.shop,
        batch_number: formData.batch_number,
        barcode: formData.barcode || undefined,
        user_type: formData.user_type as any,
        drug_type: formData.drug_type as any,
        form: formData.form as any,
        pieces_per_unit: formData.pieces_per_unit,
        unit_of_measurement: formData.unit_of_measurement as any,
        total_units: formData.total_units,
        product_description: formData.product_description || undefined,
        expiry_date: formData.expiry_date || undefined,
        purchase_date: formData.purchase_date || undefined,
        cost_price_per_piece: formData.cost_price_per_piece,
        selling_price_per_piece: formData.selling_price_per_piece,
        reorder_level: formData.reorder_level,
        is_active: formData.is_active,
      };

      let result;
      if (inventory) {
        result = await updateInventory(inventory.id, submissionData);
        toast.success("Inventory item updated successfully!");
      } else {
        result = await createInventory(submissionData);
        toast.success("Inventory item created successfully!");
      }

      if (result) {
        onSuccess();
        if (!isEmbedded) onClose();
        if (!inventory) {
          setFormData(initialFormData);
          setSelectedProduct(null);
          setSelectedPurchaseOrder(null);
          setProductSearchValue("");
          setProductSearchQuery("");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="space-y-6 p-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-purple-200 shadow-sm">
          <CardHeader className="bg-purple-50/50">
            <CardTitle className="text-lg font-semibold text-purple-800">
              <FileText className="inline-block w-5 h-5 mr-2" />
              Purchase Order Selection
            </CardTitle>
            <CardDescription className="text-purple-600">
              Select the purchase order this inventory item relates to (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="purchase_order" className="text-sm font-medium text-gray-700">
                Purchase Order
              </Label>
              <Select
                value={formData.purchase_order?.toString() || "none"}
                onValueChange={handlePurchaseOrderSelect}
                disabled={purchaseOrdersLoading}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder={purchaseOrdersLoading ? "Loading purchase orders..." : "Select purchase order (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No purchase order</SelectItem>
                  {purchaseOrders.map((po) => (
                    <SelectItem key={po.id} value={po.id!.toString()}>
                      {po.name} - {po.supplier_name || "No supplier"} ({po.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPurchaseOrder && (
                <div className="bg-purple-50 p-3 rounded-md border border-purple-200">
                  <p className="text-sm font-medium text-purple-800">{selectedPurchaseOrder.name}</p>
                  <p className="text-xs text-purple-600">Supplier: {selectedPurchaseOrder.supplier_name || "Not specified"}</p>
                  <p className="text-xs text-purple-600">Status: {selectedPurchaseOrder.status}</p>
                  {selectedPurchaseOrder.total_amount && (
                    <p className="text-xs text-purple-600">Total Amount: ${selectedPurchaseOrder.total_amount}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-sm">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="text-lg font-semibold text-blue-800">
              <Package className="inline-block w-5 h-5 mr-2" />
              Product & Shop Selection
            </CardTitle>
            <CardDescription className="text-blue-600">
              Select the product and shop for this inventory item
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Product *
                </Label>
                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={productSearchOpen}
                      className="w-full justify-between border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={productsLoading || !!inventory}
                    >
                      {productsLoading 
                        ? "Loading products..." 
                        : selectedProduct 
                          ? `${selectedProduct.name}${selectedProduct.generic_name ? ` (${selectedProduct.generic_name})` : ""}`
                          : "Select product..."
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search products..." 
                        value={productSearchQuery}
                        onValueChange={setProductSearchQuery}
                      />
                      <CommandEmpty>
                        {productSearchQuery ? "No products found matching your search." : "No products available."}
                      </CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {filteredProducts.map((product: Product) => (
                          <CommandItem
                            key={product.id}
                            value={`${product.name}-${product.id}`}
                            onSelect={() => handleProductSelect(product.id.toString())}
                            className="cursor-pointer"
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedProduct?.id === product.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div className="flex flex-col flex-1">
                              <span className="font-medium">{product.name}</span>
                              {product.generic_name && (
                                <span className="text-sm text-gray-500">Generic: {product.generic_name}</span>
                              )}
                              {product.supplier && (
                                <span className="text-xs text-gray-400">Supplier: {product.supplier}</span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedProduct && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <p className="text-sm font-medium text-blue-800">{selectedProduct.name}</p>
                    {selectedProduct.generic_name && (
                      <p className="text-xs text-blue-600">Generic: {selectedProduct.generic_name}</p>
                    )}
                    {selectedProduct.description && (
                      <p className="text-xs text-blue-600 mt-1">{selectedProduct.description}</p>
                    )}
                    {selectedProduct.supplier && (
                      <p className="text-xs text-blue-600">Supplier: {selectedProduct.supplier}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shop" className="text-sm font-medium text-gray-700">
                  Shop *
                </Label>
                <Select
                  value={formData.shop.toString()}
                  onValueChange={(value) => handleInputChange("shop", parseInt(value))}
                  disabled={shopsLoading || !!inventory}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={shopsLoading ? "Loading shops..." : "Select shop"} />
                  </SelectTrigger>
                  <SelectContent>
                    {shops.map((shop: Shop) => (
                      <SelectItem key={shop.id} value={shop.id.toString()}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50">
            <CardTitle className="text-lg font-semibold text-gray-800">
              <ShoppingCart className="inline-block w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter batch details and identification data
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="batch_number" className="text-sm font-medium text-gray-700">
                  Batch Number *
                </Label>
                <Input
                  id="batch_number"
                  value={formData.batch_number}
                  onChange={(e) => handleInputChange("batch_number", e.target.value)}
                  placeholder="Enter batch number"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode" className="text-sm font-medium text-gray-700">
                  Barcode
                </Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange("barcode", e.target.value)}
                  placeholder="Enter barcode (optional)"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase_date" className="text-sm font-medium text-gray-700">
                  Purchase Date *
                </Label>
                <div className="relative">
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => handleInputChange("purchase_date", e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date" className="text-sm font-medium text-gray-700">
                  Expiry Date
                </Label>
                <div className="relative">
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => handleInputChange("expiry_date", e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500">
                  Product expiration date for inventory tracking and safety
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 shadow-sm">
          <CardHeader className="bg-orange-50/50">
            <CardTitle className="text-lg font-semibold text-orange-800">
              Product Classification
            </CardTitle>
            <CardDescription className="text-orange-600">
              Specify the medical and regulatory classification
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="user_type" className="text-sm font-medium text-gray-700">
                  User Type
                </Label>
                <Select
                  value={formData.user_type}
                  onValueChange={(value) => handleInputChange("user_type", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adults">Adults</SelectItem>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="both">Adults & Children</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drug_type" className="text-sm font-medium text-gray-700">
                  Drug Type
                </Label>
                <Select
                  value={formData.drug_type}
                  onValueChange={(value) => handleInputChange("drug_type", value)}
                  disabled={choicesLoading}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={choicesLoading ? "Loading..." : "Select drug type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {drugTypes.map((type: { value: string; label: string }) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="form" className="text-sm font-medium text-gray-700">
                  Form
                </Label>
                <Select
                  value={formData.form}
                  onValueChange={(value) => handleInputChange("form", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="syrup">Syrup</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="cream">Cream</SelectItem>
                    <SelectItem value="drops">Drops</SelectItem>
                    <SelectItem value="inhaler">Inhaler</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-sm">
          <CardHeader className="bg-green-50/50">
            <CardTitle className="text-lg font-semibold text-green-800">
              Product Pricing & Units
            </CardTitle>
            <CardDescription className="text-green-600">
              Set product-level pricing and unit information
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="total_units" className="text-sm font-medium text-gray-700">
                  Total Units * (specify the number of individual units stock)
                </Label>
                <Input
                  id="total_units"
                  type="number"
                  min="1"
                  value={formData.total_units}
                  onChange={(e) => handleInputChange("total_units", parseInt(e.target.value) || 1)}
                  placeholder="e.g., 10"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500">
                  ie. No. of Containers with maramoja is one unit, 10 containers = 10 units
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pieces_per_unit" className="text-sm font-medium text-gray-700">
                  Pieces per Unit * (based on the total pieces contained in a unit, box, bottle)
                </Label>
                <Input
                  id="pieces_per_unit"
                  type="number"
                  min="1"
                  value={formData.pieces_per_unit}
                  onChange={(e) => handleInputChange("pieces_per_unit", parseInt(e.target.value) || 1)}
                  placeholder="e.g., 20"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500">
                  Number of individual pieces in each unit (e.g., 20 tablets per bottle)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_of_measurement" className="text-sm font-medium text-gray-700">
                  Unit of Measurement
                </Label>
                <Select
                  value={formData.unit_of_measurement}
                  onValueChange={(value) => handleInputChange("unit_of_measurement", value)}
                  disabled={choicesLoading}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder={choicesLoading ? "Loading..." : "Select unit"} />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit: { value: string; label: string }) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_description" className="text-sm font-medium text-gray-700">
                  Product Description
                </Label>
                <Input
                  id="product_description"
                  value={formData.product_description}
                  onChange={(e) => handleInputChange("product_description", e.target.value)}
                  placeholder="e.g., '50 tablets per unit', '100ml bottle'"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Optional description of the product packaging
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buying_price_per_unit" className="text-sm font-medium text-gray-700">
                  Buying Price per Unit * (Cost of each unit from supplier)
                </Label>
                <Input
                  id="buying_price_per_unit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.buying_price_per_unit}
                  onChange={(e) => handleInputChange("buying_price_per_unit", parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 200.00"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500">
                  Cost price for each complete unit from supplier
                </p>

{formData.buying_price_per_unit > 0 && formData.pieces_per_unit > 0 && formData.cost_price_per_piece > 0 && (
  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
    <p className="text-sm text-blue-800 font-medium">
      💡 Calculated Price per Piece: {(formData.cost_price_per_piece || 0.0)}
    </p>
  </div>
)}

              </div>

              <div className="space-y-2">
                <Label htmlFor="selling_price_per_piece" className="text-sm font-medium text-gray-700">
                  Selling Price per Piece *
                </Label>
                <div className="relative">
                  <Input
                    id="selling_price_per_piece"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.selling_price_per_piece}
                    onChange={(e) => handleInputChange("selling_price_per_piece", parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 30.00"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                  />
                  {calculatedSellingPrice && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => handleInputChange("selling_price_per_piece", calculatedSellingPrice)}
                      title="Use calculated price"
                    >
                      <Calculator className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Retail price for individual pieces sold to customers
                </p>
                {calculatedSellingPrice && (
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      💡 Calculated Selling Price: {calculatedSellingPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Based on 30% markup, rounded to nearest 10
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorder_level" className="text-sm font-medium text-gray-700">
                  Reorder Level
                </Label>
                <Input
                  id="reorder_level"
                  type="number"
                  min="0"
                  value={formData.reorder_level}
                  onChange={(e) => handleInputChange("reorder_level", parseInt(e.target.value) || 10)}
                  placeholder="e.g., 50"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  Minimum stock level before reordering
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {formData.buying_price_per_unit > 0 && formData.pieces_per_unit > 0 && formData.total_units > 0 && (
          <Card className="border-indigo-200 shadow-sm bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-indigo-800">
                📊 Purchase Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-gray-600">Total Pieces</p>
                  <p className="text-xl font-bold text-purple-600">
                    {(formData.pieces_per_unit * formData.total_units).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold text-red-600">
                    {(formData.buying_price_per_unit * formData.total_units).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-gray-600">Potential Revenue</p>
                  <p className="text-xl font-bold text-green-600">
                    {(formData.selling_price_per_piece * formData.pieces_per_unit * formData.total_units).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-gray-600">Potential Profit</p>
                  <p className="text-xl font-bold text-blue-600">
                    {((formData.selling_price_per_piece - formData.cost_price_per_piece) * formData.pieces_per_unit * formData.total_units).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {!isEmbedded && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {inventory ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {inventory ? "Update Inventory" : "Add to Inventory"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );

  if (!isEmbedded && !isOpen) return null;

  if (isEmbedded) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {inventory ? "Edit Inventory Item" : "Add Product from Purchase Order"}
              </h2>
              <p className="text-gray-600 mt-1">
                {inventory 
                  ? "Update inventory item details and purchase information"
                  : "Create a new inventory item by selecting a purchase order and product details"
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {formContent}
        </div>
      </div>
    </div>
  );
}