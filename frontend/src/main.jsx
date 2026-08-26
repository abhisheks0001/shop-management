import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import "./index.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
    <StrictMode>

        <BrowserRouter>

            <CustomerAuthProvider>

                <AdminAuthProvider>

                    <App />

                </AdminAuthProvider>

            </CustomerAuthProvider>

        </BrowserRouter>

    </StrictMode>
);