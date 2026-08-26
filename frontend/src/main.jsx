import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";

import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";

import "./index.css";


createRoot(
    document.getElementById("root")
).render(

    <StrictMode>

        <BrowserRouter>

            <CustomerAuthProvider>

                <AdminAuthProvider>

                    <App />

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,

                            style: {
                                borderRadius:
                                    "12px"
                            }
                        }}
                    />

                </AdminAuthProvider>

            </CustomerAuthProvider>

        </BrowserRouter>

    </StrictMode>

);