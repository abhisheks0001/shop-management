import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import { useCustomerAuth } from "../context/CustomerAuthContext";

function Navbar() {
    const navigate = useNavigate();

    const {
        customer,
        authLoading,
        logoutCustomer
    } = useCustomerAuth();

    const handleLogout = async () => {
        try {
            await logoutCustomer();

            navigate("/");

        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-gray-900"
                >
                    Shop
                    <span className="text-pink-600">
                        Nest
                    </span>
                </Link>


                <nav className="hidden items-center gap-8 md:flex">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-pink-600"
                                : "text-gray-600 transition hover:text-pink-600"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive
                                ? "font-semibold text-pink-600"
                                : "text-gray-600 transition hover:text-pink-600"
                        }
                    >
                        Products
                    </NavLink>

                </nav>


                <div className="flex items-center gap-3">

                    {!authLoading && customer ? (

                        <>
                            <div className="hidden text-right sm:block">

                                <p className="text-xs text-gray-500">
                                    Welcome
                                </p>

                                <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
                                    {customer.name}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">

                                {customer.name
                                    ?.charAt(0)}

                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Logout
                            </button>
                        </>

                    ) : !authLoading ? (

                        <Link
                            to="/login"
                            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
                        >
                            Login
                        </Link>

                    ) : (

                        <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />

                    )}

                </div>

            </div>

        </header>
    );
}

export default Navbar;