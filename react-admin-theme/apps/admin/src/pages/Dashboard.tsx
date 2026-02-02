import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const { data: productsData } = useList({ resource: "products" });
  const { data: categoriesData } = useList({ resource: "categories" });

  const productCount = productsData?.total || 0;
  const categoryCount = categoriesData?.total || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to Vacuum Pumps Admin Panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Vacuum pump products in catalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Product categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              System running normally
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/products/create">
                <Package className="h-4 w-4 mr-2" />
                Add New Product
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/categories/create">
                <FolderTree className="h-4 w-4 mr-2" />
                Add New Category
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Add or edit products using the Products menu</li>
              <li>Click "Export Data" in the sidebar</li>
              <li>Run <code className="bg-muted px-1 rounded">pnpm build:web</code></li>
              <li>Upload <code className="bg-muted px-1 rounded">apps/web/out/</code> to hosting</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
