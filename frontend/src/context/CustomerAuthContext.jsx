import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/api";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
    const [customer, setCustomer] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const checkCustomer = async () => {
            try {
                const response = await api.get(
                    "/customer/me"
                );

                setCustomer(response.data.customer);
            } catch (error) {
                setCustomer(null);
            } finally {
                setAuthLoading(false);
            }
        };

        checkCustomer();
    }, []);

    const logoutCustomer = async () => {
        await api.post("/customer/logout");

        setCustomer(null);
    };

    return (
        <CustomerAuthContext.Provider
            value={{
                customer,
                setCustomer,
                authLoading,
                logoutCustomer
            }}
        >
            {children}
        </CustomerAuthContext.Provider>
    );
}

export function useCustomerAuth() {
    return useContext(CustomerAuthContext);
}