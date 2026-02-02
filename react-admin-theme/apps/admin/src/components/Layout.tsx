import { Link, useLocation } from "react-router-dom";
import { Package, FolderTree, Home, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: FolderTree },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("http://localhost:3001/api/export", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Exported ${data.products} products and ${data.categories} categories!`);
      }
    } catch {
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Vacuum Pumps</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export Data"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
