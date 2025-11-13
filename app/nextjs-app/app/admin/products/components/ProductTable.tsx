import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Loader2, Edit, Trash2, Plus } from "lucide-react";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  searchQuery: string;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

export function ProductTable({
  products,
  loading,
  searchQuery,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Products Catalog
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && (
              <Button onClick={onAddProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Product Details
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.generic_name}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {product.description || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                          className="h-8 w-8 p-0"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProduct(product.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
