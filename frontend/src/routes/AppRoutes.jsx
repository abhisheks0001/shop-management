import {
    Routes,
    Route
} from "react-router-dom";


// Customer
import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import CategoryProducts from "../pages/customer/CategoryProducts";
import ProductDetails from "../pages/customer/ProductDetails";
import CustomerLogin from "../pages/customer/CustomerLogin";


// Admin
import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/ProductList";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";


function AppRoutes() {
    return (
        <Routes>

            {/* ========================
                CUSTOMER ROUTES
            ======================== */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/products"
                element={<Products />}
            />

            <Route
                path="/category/:category"
                element={<CategoryProducts />}
            />

            <Route
                path="/category/:category/:subCategory"
                element={<CategoryProducts />}
            />

            <Route
                path="/product/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/login"
                element={<CustomerLogin />}
            />


            {/* ========================
                 ADMIN ROUTES
            ======================== */}

            <Route
                path="/admin/login"
                element={<AdminLogin />}
            />

            <Route
                path="/admin/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/admin/products"
                element={<ProductList />}
            />

            <Route
                path="/admin/products/add"
                element={<AddProduct />}
            />

            <Route
                path="/admin/products/edit/:id"
                element={<EditProduct />}
            />


            {/* ========================
                   NOT FOUND
            ======================== */}

            <Route
                path="*"
                element={
                    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

                        <div className="text-center">

                            <p className="text-7xl font-black text-pink-600">
                                404
                            </p>

                            <h1 className="mt-4 text-3xl font-bold text-gray-900">
                                Page not found
                            </h1>

                            <p className="mt-3 text-gray-500">
                                The page you're looking for
                                doesn't exist.
                            </p>

                            <a
                                href="/"
                                className="mt-7 inline-block rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                            >
                                Go Home
                            </a>

                        </div>

                    </div>
                }
            />

        </Routes>
    );
}

export default AppRoutes;