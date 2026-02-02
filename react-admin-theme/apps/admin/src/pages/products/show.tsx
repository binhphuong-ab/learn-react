import { useOne } from "@refinedev/core";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  image: string;
  specs: Record<string, string>;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export function ProductShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useOne<Product>({
    resource: "products",
    id: id!,
  });

  const product = data?.data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Product not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground mt-1">Product details</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/products/edit/${product._id}`}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Product
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="text-lg">{product.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Slug</div>
              <div className="font-mono text-sm">{product.slug}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Category</div>
              <div>{product.category}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Price</div>
              <div className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="mt-1">
                {product.featured ? (
                  <Badge>Featured</Badge>
                ) : (
                  <Badge variant="secondary">Standard</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image</CardTitle>
          </CardHeader>
          <CardContent>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {product.description}
            </p>
          </CardContent>
        </Card>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="bg-muted/50 rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      {key}
                    </div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Created At
                </div>
                <div>{formatDate(product.createdAt)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Updated At
                </div>
                <div>{formatDate(product.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
