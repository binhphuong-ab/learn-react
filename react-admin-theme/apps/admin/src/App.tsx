import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import routerBindings from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";

import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { ProductList } from "./pages/products/list";
import { ProductCreate } from "./pages/products/create";
import { ProductEdit } from "./pages/products/edit";
import { ProductShow } from "./pages/products/show";
import { CategoryList } from "./pages/categories/list";
import { CategoryCreate } from "./pages/categories/create";
import { CategoryEdit } from "./pages/categories/edit";

const API_URL = "http://localhost:3001/api";

function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider(API_URL)}
        routerProvider={routerBindings}
        resources={[
          {
            name: "products",
            list: "/products",
            create: "/products/create",
            edit: "/products/edit/:id",
            show: "/products/show/:id",
          },
          {
            name: "categories",
            list: "/categories",
            create: "/categories/create",
            edit: "/categories/edit/:id",
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/products">
              <Route index element={<ProductList />} />
              <Route path="create" element={<ProductCreate />} />
              <Route path="edit/:id" element={<ProductEdit />} />
              <Route path="show/:id" element={<ProductShow />} />
            </Route>
            <Route path="/categories">
              <Route index element={<CategoryList />} />
              <Route path="create" element={<CategoryCreate />} />
              <Route path="edit/:id" element={<CategoryEdit />} />
            </Route>
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
