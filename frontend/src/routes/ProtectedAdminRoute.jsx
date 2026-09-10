import { Navigate } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";

function ProtectedAdminRoute({ children }) {
    const {
        admin,
        adminLoading
    } = useAdminAuth();


    if (adminLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-pink-500" />

                    <p className="mt-4 text-sm text-gray-400">
                        Checking admin access...
                    </p>

                </div>

            </div>
        );
    }


    if (!admin) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }


    return children;
}

export default ProtectedAdminRoute;