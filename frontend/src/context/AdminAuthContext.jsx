import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/api";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await api.get("/admin/me");

                setAdmin(response.data.admin);

            } catch (error) {
                setAdmin(null);

            } finally {
                setAdminLoading(false);
            }
        };

        checkAdmin();
    }, []);


    const logoutAdmin = async () => {
        await api.post("/admin/logout");

        setAdmin(null);
    };


    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                setAdmin,
                adminLoading,
                logoutAdmin
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}


export function useAdminAuth() {
    return useContext(AdminAuthContext);
}