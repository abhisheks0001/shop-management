import { useState } from "react";
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom";

import categories from "../config/categories";
import { useCustomerAuth } from "../context/CustomerAuthContext";

function Navbar() {
    const navigate = useNavigate();

    const {
        customer,
        authLoading,
        logoutCustomer
    } = useCustomerAuth();

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutCustomer();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

            {/* Main Navbar */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-gray-900"
                >
                    Shop
                    <span className="text-pink-600">
                        Nest
                    </span>
                </Link>

                {/* Desktop Navigation */}
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

                    {/* Category Dropdown */}
                    <div className="relative">

                        <button
                            type="button"
                            onClick={() =>
                                setCategoryOpen((prev) => !prev)
                            }
                            className="flex items-center gap-1 font-medium text-gray-600 transition hover:text-pink-600"
                        >
                            Categories

                            <span
                                className={`transition ${
                                    categoryOpen
                                        ? "rotate-180"
                                        : ""
                                }`}
                            >
                                ▾
                            </span>
                        </button>

                        {categoryOpen && (

                            <div className="absolute left-1/2 top-10 w-[420px] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">

                                <div className="grid grid-cols-2 gap-8">

                                    {Object.entries(categories).map(
                                        ([
                                            category,
                                            subCategories
                                        ]) => (

                                            <div key={category}>

                                                <Link
                                                    to={`/category/${encodeURIComponent(
                                                        category
                                                    )}`}
                                                    onClick={() =>
                                                        setCategoryOpen(
                                                            false
                                                        )
                                                    }
                                                    className="text-base font-bold text-gray-900 transition hover:text-pink-600"
                                                >
                                                    {category}
                                                </Link>

                                                <div className="mt-3 flex flex-col gap-2">

                                                    {subCategories.map(
                                                        (
                                                            subCategory
                                                        ) => (

                                                            <Link
                                                                key={
                                                                    subCategory
                                                                }
                                                                to={`/category/${encodeURIComponent(
                                                                    category
                                                                )}/${encodeURIComponent(
                                                                    subCategory
                                                                )}`}
                                                                onClick={() =>
                                                                    setCategoryOpen(
                                                                        false
                                                                    )
                                                                }
                                                                className="text-sm text-gray-500 transition hover:translate-x-1 hover:text-pink-600"
                                                            >
                                                                {
                                                                    subCategory
                                                                }
                                                            </Link>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </nav>


                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {!authLoading && customer ? (

                        <>
                            {/* Customer Name */}
                            <div className="hidden text-right lg:block">

                                <p className="text-xs text-gray-400">
                                    Welcome
                                </p>

                                <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
                                    {customer.name}
                                </p>

                            </div>

                            {/* Avatar */}
                            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700 sm:flex">
                                {customer.name?.charAt(0)}
                            </div>

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:block"
                            >
                                Logout
                            </button>
                        </>

                    ) : !authLoading ? (

                        <Link
                            to="/login"
                            className="hidden rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600 sm:block"
                        >
                            Login
                        </Link>

                    ) : (

                        <div className="hidden h-10 w-24 animate-pulse rounded-full bg-gray-200 sm:block" />

                    )}


                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileOpen((prev) => !prev)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 text-xl md:hidden"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>

                </div>

            </div>


            {/* Mobile Menu */}
            {mobileOpen && (

                <div className="border-t border-gray-200 bg-white px-4 py-5 md:hidden">

                    <div className="flex flex-col">

                        <Link
                            to="/"
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className="border-b border-gray-100 py-3 font-semibold text-gray-700"
                        >
                            Home
                        </Link>

                        <Link
                            to="/products"
                            onClick={() =>
                                setMobileOpen(false)
                            }
                            className="border-b border-gray-100 py-3 font-semibold text-gray-700"
                        >
                            Products
                        </Link>


                        {/* Mobile Categories */}
                        <div className="py-5">

                            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                Categories
                            </p>

                            {Object.entries(categories).map(
                                ([
                                    category,
                                    subCategories
                                ]) => (

                                    <div
                                        key={category}
                                        className="mb-6"
                                    >

                                        <Link
                                            to={`/category/${encodeURIComponent(
                                                category
                                            )}`}
                                            onClick={() =>
                                                setMobileOpen(
                                                    false
                                                )
                                            }
                                            className="font-bold text-gray-900"
                                        >
                                            {category}
                                        </Link>

                                        <div className="mt-3 ml-4 flex flex-col gap-3">

                                            {subCategories.map(
                                                (
                                                    subCategory
                                                ) => (

                                                    <Link
                                                        key={
                                                            subCategory
                                                        }
                                                        to={`/category/${encodeURIComponent(
                                                            category
                                                        )}/${encodeURIComponent(
                                                            subCategory
                                                        )}`}
                                                        onClick={() =>
                                                            setMobileOpen(
                                                                false
                                                            )
                                                        }
                                                        className="text-sm text-gray-500"
                                                    >
                                                        {
                                                            subCategory
                                                        }
                                                    </Link>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>


                        {/* Mobile Authentication */}
                        {!authLoading && customer ? (

                            <div className="border-t border-gray-100 pt-5">

                                <div className="mb-4 flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">
                                        {customer.name?.charAt(
                                            0
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Logged in as
                                        </p>

                                        <p className="font-semibold text-gray-900">
                                            {customer.name}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={async () => {
                                        await handleLogout();

                                        setMobileOpen(
                                            false
                                        );
                                    }}
                                    className="w-full rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600"
                                >
                                    Logout
                                </button>

                            </div>

                        ) : (

                            <Link
                                to="/login"
                                onClick={() =>
                                    setMobileOpen(false)
                                }
                                className="rounded-xl bg-gray-900 px-5 py-3 text-center font-semibold text-white"
                            >
                                Customer Login
                            </Link>

                        )}

                    </div>

                </div>

            )}

        </header>
    );
}

export default Navbar;