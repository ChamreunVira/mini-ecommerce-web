'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ProductTable } from '@/components/products/ProductTable';
import { ProductViewDialog } from '@/components/products/ProductViewDialog';
import { DeleteProductDialog } from '@/components/products/DeleteProductDialog';
import { productService } from '@/services/product-service';
import { getErrorMessage } from '@/lib/axios';
import type { Product } from '@/types';
import type { PaginationMeta } from '@/types';

const PAGE_SIZE = 10;

const INITIAL_PAGINATION: PaginationMeta = {
  current_page: 1,
  limit: PAGE_SIZE,
  total: 0,
  last_page: 1,
  has_more_pages: false,
};

export default function ProductsPage() {
  
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(INITIAL_PAGINATION);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await productService.getAll({
          page,
          limit: PAGE_SIZE,
        });

        if (!isActive) return;

        setProducts(response.data);
        setPagination(response.meta);
      } catch (error) {
        if (!isActive) return;

        setErrorMessage(getErrorMessage(error, 'Failed to load products.'));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [page]);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      await productService.delete(productToDelete.id);

      const remainingProducts = products.filter((product) => product.id !== productToDelete.id);

      const remainingTotal = Math.max(0, pagination.total - 1);
      const lastPage = Math.max(1, Math.ceil(remainingTotal / PAGE_SIZE));

      toast.success(`"${productToDelete.name}" deleted.`);
      setProductToDelete(null);

      if (remainingProducts.length === 0 && page > lastPage) {
        setPage(lastPage);
      } else {
        setProducts(remainingProducts);
        setPagination((previous) => ({
          ...previous,
          total: remainingTotal,
          last_page: lastPage,
          has_more_pages: page < lastPage,
        }));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete product.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your catalog, pricing, and stock.</p>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">
            <Plus />
            Add product
          </Link>
        </Button>
      </div>

      <ProductTable
        products={products}
        isLoading={isLoading}
        errorMessage={errorMessage}
        paginationMeta={pagination}
        onPageChange={setPage}
        onView={setViewingProduct}
        onDelete={setProductToDelete}
      />

      <ProductViewDialog product={viewingProduct} onClose={() => setViewingProduct(null)} />

      <DeleteProductDialog
        product={productToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setProductToDelete(null)}
      />
    </div>
  );
}
