import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Products from "../pages/customer/Products";
import ProductDetails from "../pages/customer/ProductDetails";
import CustomerLogin from "../pages/customer/CustomerLogin";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/products" element={<Products />} />

            <Route
                path="/product/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/login"
                element={<CustomerLogin />}
            />

        </Routes>
    );
}

export default AppRoutes;