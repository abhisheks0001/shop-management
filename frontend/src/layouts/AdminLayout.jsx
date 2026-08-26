import {
    useState
} from "react";

import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    useAdminAuth
} from "../context/AdminAuthContext";


function AdminLayout({
    children
}) {

    const navigate =
        useNavigate();


    const {
        admin,
        adminLoading,
        logoutAdmin
    } = useAdminAuth();


    const [
        sidebarOpen,
        setSidebarOpen
    ] = useState(false);


    const [
        logoutModal,
        setLogoutModal
    ] = useState(false);


    const [
        loggingOut,
        setLoggingOut
    ] = useState(false);


    // ============================================
    // LOGOUT
    // ============================================

    const handleLogout =
        async () => {

        try {

            setLoggingOut(true);


            await logoutAdmin();


            toast.success(
                "Admin logged out successfully"
            );


            setLogoutModal(false);

            setSidebarOpen(false);


            navigate(
                "/admin/login",
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "Admin logout error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to logout."
            );


        } finally {

            setLoggingOut(false);

        }

    };


    // ============================================
    // NAVIGATION STYLE
    // ============================================

    const navClass =
        ({ isActive }) => {

        return `
            flex items-center gap-3
            rounded-xl px-4 py-3
            text-sm font-semibold
            transition

            ${
                isActive

                    ? "bg-pink-50 text-pink-600"

                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
        `;

    };


    // ============================================
    // AUTH LOADING
    // ============================================

    if (adminLoading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <div className="text-center">

                    <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-pink-600" />

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading admin dashboard...
                    </p>

                </div>

            </div>

        );

    }


    // ============================================
    // LAYOUT
    // ============================================

    return (

        <div className="min-h-screen bg-gray-50">


            {/* =================================
                    MOBILE OVERLAY
            ================================= */}

            {sidebarOpen && (

                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                />

            )}


            {/* =================================
                    SIDEBAR
            ================================= */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-72 flex-col
                    border-r border-gray-200
                    bg-white
                    transition-transform
                    duration-300

                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }

                    lg:translate-x-0
                `}
            >


                {/* LOGO */}

                <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">


                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 font-black text-white">
                            S
                        </div>


                        <div>

                            <p className="text-xl font-black tracking-tight text-gray-900">

                                Shop

                                <span className="text-pink-600">
                                    Nest
                                </span>

                            </p>


                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Admin
                            </p>

                        </div>


                    </Link>


                    <button
                        type="button"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        ✕
                    </button>


                </div>


                {/* =================================
                       ADMIN PROFILE
                ================================= */}

                <div className="border-b border-gray-100 p-5">


                    <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-gray-50 to-pink-50 p-4">


                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">

                            {admin?.name
                                ?.charAt(0) ||
                                "A"}

                        </div>


                        <div className="min-w-0">


                            <p className="truncate font-bold text-gray-900">

                                {admin?.name ||
                                    "Administrator"}

                            </p>


                            <p className="mt-1 truncate text-xs text-gray-500">

                                {admin?.email ||
                                    "Admin account"}

                            </p>


                        </div>


                    </div>


                </div>


                {/* =================================
                      NAVIGATION
                ================================= */}

                <nav className="flex-1 overflow-y-auto p-4">


                    <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Management
                    </p>


                    <div className="space-y-1">


                        <NavLink
                            to="/admin/dashboard"
                            className={
                                navClass
                            }
                        >

                            <span className="text-lg">
                                📊
                            </span>

                            Dashboard

                        </NavLink>


                        <NavLink
                            to="/admin/products"
                            end
                            className={
                                navClass
                            }
                        >

                            <span className="text-lg">
                                📦
                            </span>

                            Products

                        </NavLink>


                        <NavLink
                            to="/admin/products/add"
                            className={
                                navClass
                            }
                        >

                            <span className="text-lg">
                                ＋
                            </span>

                            Add Product

                        </NavLink>


                        <NavLink
                            to="/admin/customers"
                            className={
                                navClass
                            }
                        >

                            <span className="text-lg">
                                👥
                            </span>

                            Customers

                        </NavLink>


                    </div>


                    <p className="mb-3 mt-8 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Shop
                    </p>


                    <div className="space-y-1">


                        <Link
                            to="/"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                        >

                            <span className="text-lg">
                                🛍️
                            </span>

                            View Shop

                        </Link>


                    </div>


                </nav>


                {/* =================================
                       LOGOUT
                ================================= */}

                <div className="border-t border-gray-100 p-4">


                    <button
                        type="button"
                        onClick={() =>
                            setLogoutModal(true)
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >

                        <span className="text-lg">
                            ↪
                        </span>

                        Logout

                    </button>


                </div>


            </aside>


            {/* =================================
                    MAIN CONTENT
            ================================= */}

            <div className="lg:pl-72">


                {/* =================================
                       TOP NAVBAR
                ================================= */}

                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur md:px-8">


                    <div className="flex items-center gap-4">


                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-xl text-gray-700 hover:bg-gray-50 lg:hidden"
                        >
                            ☰
                        </button>


                        <div>


                            <p className="font-bold text-gray-900">
                                Admin Dashboard
                            </p>


                            <p className="hidden text-xs text-gray-400 sm:block">
                                Manage your shop
                            </p>


                        </div>


                    </div>


                    {/* ADMIN TOP PROFILE */}

                    <div className="flex items-center gap-3">


                        <Link
                            to="/"
                            className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:block"
                        >
                            View Shop
                        </Link>


                        <div className="flex items-center gap-2">


                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold uppercase text-pink-700">

                                {admin?.name
                                    ?.charAt(0) ||
                                    "A"}

                            </div>


                            <div className="hidden md:block">

                                <p className="max-w-36 truncate text-sm font-semibold text-gray-900">

                                    {admin?.name ||
                                        "Admin"}

                                </p>

                                <p className="text-[10px] font-semibold text-green-600">
                                    ● Online
                                </p>

                            </div>


                        </div>


                    </div>


                </header>


                {/* =================================
                        PAGE CONTENT
                ================================= */}

                <main className="p-4 md:p-8">

                    {children}

                </main>


            </div>



            {/* =================================
                 LOGOUT CONFIRMATION MODAL
            ================================= */}

            {logoutModal && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                                e.currentTarget &&
                            !loggingOut
                        ) {

                            setLogoutModal(
                                false
                            );

                        }

                    }}
                >


                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">


                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                            ↪
                        </div>


                        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-red-600">
                            Admin Session
                        </p>


                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            Logout from dashboard?
                        </h2>


                        <p className="mt-3 leading-7 text-gray-500">

                            You are about to end your
                            administrator session.

                        </p>


                        {/* ADMIN */}

                        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-4">


                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">

                                {admin?.name
                                    ?.charAt(0) ||
                                    "A"}

                            </div>


                            <div className="min-w-0">


                                <p className="truncate font-semibold text-gray-900">

                                    {admin?.name ||
                                        "Administrator"}

                                </p>


                                <p className="mt-1 truncate text-sm text-gray-500">

                                    {admin?.email ||
                                        "Admin account"}

                                </p>


                            </div>


                        </div>


                        <p className="mt-5 text-sm leading-6 text-gray-500">

                            You'll need to enter your
                            administrator credentials again
                            to access protected management
                            pages.

                        </p>


                        {/* BUTTONS */}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">


                            <button
                                type="button"
                                disabled={
                                    loggingOut
                                }
                                onClick={() =>
                                    setLogoutModal(
                                        false
                                    )
                                }
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={
                                    loggingOut
                                }
                                onClick={
                                    handleLogout
                                }
                                className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {loggingOut ? (

                                    <>

                                        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                        Logging out...

                                    </>

                                ) : (

                                    "Yes, Logout"

                                )}

                            </button>


                        </div>


                    </div>


                </div>

            )}


        </div>

    );

}


export default AdminLayout;