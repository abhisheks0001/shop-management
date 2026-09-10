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

const CustomerAuthContext =
    createContext(null);


// ============================================
// PROVIDER
// ============================================

export function CustomerAuthProvider({
    children
}) {

    const [customer, setCustomer] =
        useState(null);

    const [
        customerLoading,
        setCustomerLoading
    ] = useState(true);


    // ========================================
    // CHECK EXISTING CUSTOMER SESSION
    // ========================================

    useEffect(() => {

        const checkCustomerAuth =
            async () => {

            try {

                /*
                    Backend should read the
                    customerToken HTTP-only cookie.

                    Expected endpoint:

                    GET /api/customer/me
                */

                const response =
                    await api.get(
                        "/customer/me"
                    );


                setCustomer(
                    response.data.customer
                );


            } catch (error) {

                /*
                    401 simply means the visitor
                    isn't currently logged in.

                    This is normal, so don't show
                    an error toast here.
                */

                if (
                    error.response?.status !==
                    401
                ) {

                    console.error(
                        "Customer auth check failed:",
                        error
                    );

                }


                setCustomer(null);


            } finally {

                setCustomerLoading(
                    false
                );

            }

        };


        checkCustomerAuth();

    }, []);


    // ========================================
    // CUSTOMER LOGOUT
    // ========================================

    const logoutCustomer =
        async () => {

        /*
            Expected backend endpoint:

            POST /api/customer/logout

            Backend should:
            1. Clear customerToken cookie
            2. Return 200
        */

        await api.post(
            "/customer/logout"
        );


        /*
            Only clear frontend state after
            backend successfully clears cookie.
        */

        setCustomer(null);

    };


    // ========================================
    // OPTIONAL REFRESH CUSTOMER
    // ========================================

    const refreshCustomer =
        async () => {

        try {

            const response =
                await api.get(
                    "/customer/me"
                );


            setCustomer(
                response.data.customer
            );


            return response.data.customer;


        } catch (error) {

            setCustomer(null);

            throw error;

        }

    };


    // ========================================
    // CONTEXT VALUE
    // ========================================

    const value = {

        customer,

        setCustomer,

        customerLoading,

        logoutCustomer,

        refreshCustomer

    };


    return (

        <CustomerAuthContext.Provider
            value={value}
        >

            {children}

        </CustomerAuthContext.Provider>

    );

}


// ============================================
// CUSTOM HOOK
// ============================================

export function useCustomerAuth() {

    const context =
        useContext(
            CustomerAuthContext
        );


    if (!context) {

        throw new Error(
            "useCustomerAuth must be used inside CustomerAuthProvider"
        );

    }


    return context;

}