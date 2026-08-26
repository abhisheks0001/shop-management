import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/api";


// ============================================
// CREATE CONTEXT
// ============================================

const AdminAuthContext =
    createContext(null);


// ============================================
// PROVIDER
// ============================================

export function AdminAuthProvider({
    children
}) {

    const [admin, setAdmin] =
        useState(null);

    const [
        adminLoading,
        setAdminLoading
    ] = useState(true);


    // ========================================
    // CHECK EXISTING ADMIN SESSION
    // ========================================

    useEffect(() => {

        const checkAdminAuth =
            async () => {

            try {

                /*
                    Browser automatically sends
                    adminToken HTTP-only cookie.

                    Expected backend:

                    GET /api/admin/me
                */

                const response =
                    await api.get(
                        "/admin/me"
                    );


                setAdmin(
                    response.data.admin
                );


            } catch (error) {

                /*
                    401 simply means admin is
                    currently not logged in.
                */

                if (
                    error.response?.status !==
                    401
                ) {

                    console.error(
                        "Admin auth check failed:",
                        error
                    );

                }


                setAdmin(null);


            } finally {

                setAdminLoading(false);

            }

        };


        checkAdminAuth();

    }, []);


    // ========================================
    // ADMIN LOGOUT
    // ========================================

    const logoutAdmin =
        async () => {

        /*
            Backend clears the adminToken cookie.

            Expected:

            POST /api/admin/logout
        */

        await api.post(
            "/admin/logout"
        );


        /*
            Only clear frontend state after
            backend logout succeeds.
        */

        setAdmin(null);

    };


    // ========================================
    // REFRESH ADMIN
    // ========================================

    const refreshAdmin =
        async () => {

        try {

            const response =
                await api.get(
                    "/admin/me"
                );


            setAdmin(
                response.data.admin
            );


            return response.data.admin;


        } catch (error) {

            setAdmin(null);

            throw error;

        }

    };


    // ========================================
    // CONTEXT VALUE
    // ========================================

    const value = {

        admin,

        setAdmin,

        adminLoading,

        logoutAdmin,

        refreshAdmin

    };


    return (

        <AdminAuthContext.Provider
            value={value}
        >

            {children}

        </AdminAuthContext.Provider>

    );

}


// ============================================
// CUSTOM HOOK
// ============================================

export function useAdminAuth() {

    const context =
        useContext(
            AdminAuthContext
        );


    if (!context) {

        throw new Error(
            "useAdminAuth must be used inside AdminAuthProvider"
        );

    }


    return context;

}