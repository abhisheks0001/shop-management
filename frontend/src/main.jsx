import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import "./index.css";

import App from "./App";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>

            <CustomerAuthProvider>
                <App />
            </CustomerAuthProvider>

        </BrowserRouter>
    </StrictMode>
);