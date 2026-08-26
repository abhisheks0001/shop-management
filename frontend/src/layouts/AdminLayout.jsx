import { useState } from "react";

import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";


function AdminLayout({ children }) {
    const navigate = useNavigate();

    const {
        admin,
        logoutAdmin
    } = useAdminAuth();

    const [mobileSidebar, setMobileSidebar] =
        useState(false);


    const handleLogout = async () => {
        try {
            await logoutAdmin();

            navigate(
                "/admin/login",
                {
                    replace: true
                }
            );

        } catch (error) {
            console.error(
                "Admin logout failed:",
                error
            );
        }
    };


    const navItems = [
        {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: "▦"
        },
        {
            label: "Products",
            path: "/admin/products",
            icon: "□"
        },
        {
            label: "Add Product",
            path: "/admin/products/add",
            icon: "+"
        }
    ];


    const SidebarContent = () => (
        <>

            {/* Logo */}
            <div className="border-b border-white/10 px-6 py-6">

                <Link
                    to="/admin/dashboard"
                    className="text-2xl font-bold text-white"
                >
                    Shop
                    <span className="text-pink-500">
                        Nest
                    </span>
                </Link>

                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Administration
                </p>

            </div>


            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">

                {navItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() =>
                            setMobileSidebar(false)
                        }
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                isActive
                                    ? "bg-pink-600 text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >

                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5">
                            {item.icon}
                        </span>

                        {item.label}

                    </NavLink>

                ))}

            </nav>


            {/* Admin */}
            <div className="border-t border-white/10 p-4">

                <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-600 font-bold uppercase text-white">

                        {admin?.name?.charAt(0)}

                    </div>

                    <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-white">
                            {admin?.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                            {admin?.email}
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                    Logout
                </button>

            </div>

        </>
    );


    return (
        <div className="min-h-screen bg-gray-100">

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col bg-gray-950 lg:flex">

                <SidebarContent />

            </aside>


            {/* Mobile Overlay */}
            {mobileSidebar && (

                <div
                    onClick={() =>
                        setMobileSidebar(false)
                    }
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />

            )}


            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gray-950 transition-transform duration-300 lg:hidden ${
                    mobileSidebar
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                <SidebarContent />

            </aside>


            {/* Main */}
            <div className="lg:pl-72">

                {/* Topbar */}
                <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">

                    <div className="flex h-18 items-center justify-between px-4 py-4 md:px-8">

                        <div className="flex items-center gap-4">

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileSidebar(true)
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-xl lg:hidden"
                            >
                                ☰
                            </button>


                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Shop Management
                                </p>

                                <p className="font-bold text-gray-900">
                                    Admin Panel
                                </p>

                            </div>

                        </div>


                        <Link
                            to="/"
                            target="_blank"
                            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                            View Shop ↗
                        </Link>

                    </div>

                </header>


                {/* Page Content */}
                <main className="p-4 md:p-8">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default AdminLayout;