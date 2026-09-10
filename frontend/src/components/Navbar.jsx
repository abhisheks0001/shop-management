import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    NavLink,
    useLocation,
    useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import categories from "../config/categories";

import {
    useCustomerAuth
} from "../context/CustomerAuthContext";


function Navbar() {

    const navigate =
        useNavigate();

    const location =
        useLocation();


    const {
        customer,
        customerLoading,
        logoutCustomer
    } = useCustomerAuth();


    const [
        mobileMenuOpen,
        setMobileMenuOpen
    ] = useState(false);


    const [
        categoryOpen,
        setCategoryOpen
    ] = useState(false);


    const [
        mobileCategory,
        setMobileCategory
    ] = useState(null);


    const [
        profileOpen,
        setProfileOpen
    ] = useState(false);


    const categoryRef =
        useRef(null);

    const profileRef =
        useRef(null);


    // ============================================
    // CLOSE MENUS WHEN ROUTE CHANGES
    // ============================================

    useEffect(() => {

        setMobileMenuOpen(false);

        setCategoryOpen(false);

        setProfileOpen(false);

        setMobileCategory(null);

    }, [location.pathname]);


    // ============================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ============================================

    useEffect(() => {

        const handleOutsideClick =
            (event) => {

            if (
                categoryRef.current &&
                !categoryRef.current.contains(
                    event.target
                )
            ) {

                setCategoryOpen(false);

            }


            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {

                setProfileOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // ============================================
    // LOGOUT
    // ============================================

    const handleLogout =
        async () => {

        try {

            await logoutCustomer();


            toast.success(
                "Logged out successfully"
            );


            setProfileOpen(false);

            setMobileMenuOpen(false);


            navigate(
                "/",
                {
                    replace: true
                }
            );


        } catch (error) {

            console.error(
                "Customer logout failed:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to logout."
            );

        }

    };


    // ============================================
    // ACTIVE LINK STYLE
    // ============================================

    const navClass =
        ({ isActive }) => {

        return `
            relative text-sm font-semibold
            transition
            ${
                isActive
                    ? "text-pink-600"
                    : "text-gray-600 hover:text-pink-600"
            }
        `;

    };


    // ============================================
    // CATEGORY LINK
    // ============================================

    const getCategoryPath =
        (category) => {

        return `/category/${encodeURIComponent(
            category
        )}`;

    };


    // ============================================
    // SUBCATEGORY LINK
    // ============================================

    const getSubCategoryPath =
        (
            category,
            subCategory
        ) => {

        return `/category/${encodeURIComponent(
            category
        )}/${encodeURIComponent(
            subCategory
        )}`;

    };


    return (

        <>

            <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-xl">


                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">


                    {/* =================================
                              LOGO
                    ================================= */}

                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                    >


                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg font-black text-white transition group-hover:bg-pink-600">

                            S

                        </div>


                        <div>

                            <p className="text-xl font-black tracking-tight text-gray-900">

                                Shop

                                <span className="text-pink-600">
                                    Nest
                                </span>

                            </p>


                            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:block">
                                Everyday Store
                            </p>

                        </div>


                    </Link>



                    {/* =================================
                         DESKTOP NAVIGATION
                    ================================= */}

                    <nav className="hidden items-center gap-8 lg:flex">


                        <NavLink
                            to="/"
                            end
                            className={
                                navClass
                            }
                        >
                            Home
                        </NavLink>


                        <NavLink
                            to="/products"
                            className={
                                navClass
                            }
                        >
                            Products
                        </NavLink>



                        {/* =================================
                            CATEGORY DROPDOWN
                        ================================= */}

                        <div
                            ref={
                                categoryRef
                            }
                            className="relative"
                        >


                            <button
                                type="button"
                                onClick={() => {

                                    setCategoryOpen(
                                        (current) =>
                                            !current
                                    );

                                    setProfileOpen(
                                        false
                                    );

                                }}
                                className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                                    location.pathname.startsWith(
                                        "/category"
                                    )
                                        ? "text-pink-600"
                                        : "text-gray-600 hover:text-pink-600"
                                }`}
                            >

                                Categories


                                <span
                                    className={`text-xs transition-transform duration-200 ${
                                        categoryOpen
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                >
                                    ▼
                                </span>


                            </button>



                            {categoryOpen && (

                                <div className="absolute left-1/2 top-full mt-6 w-[650px] -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">


                                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">


                                        <p className="font-bold text-gray-900">
                                            Shop by Category
                                        </p>


                                        <p className="mt-1 text-xs text-gray-500">
                                            Explore our product
                                            catalogue.
                                        </p>


                                    </div>



                                    <div className="grid max-h-[500px] grid-cols-2 gap-3 overflow-y-auto p-5">


                                        {Object.entries(
                                            categories
                                        ).map(
                                            ([
                                                category,
                                                subCategories
                                            ]) => (

                                            <div
                                                key={
                                                    category
                                                }
                                                className="rounded-xl border border-gray-100 p-4 transition hover:border-pink-100 hover:bg-pink-50/40"
                                            >


                                                <Link
                                                    to={
                                                        getCategoryPath(
                                                            category
                                                        )
                                                    }
                                                    className="font-bold text-gray-900 transition hover:text-pink-600"
                                                >
                                                    {
                                                        category
                                                    }
                                                </Link>



                                                <div className="mt-3 flex flex-wrap gap-2">


                                                    {subCategories
                                                        .slice(
                                                            0,
                                                            5
                                                        )
                                                        .map(
                                                            (
                                                                subCategory
                                                            ) => (

                                                            <Link
                                                                key={
                                                                    subCategory
                                                                }
                                                                to={
                                                                    getSubCategoryPath(
                                                                        category,
                                                                        subCategory
                                                                    )
                                                                }
                                                                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-pink-100 hover:text-pink-700"
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



                    {/* =================================
                         DESKTOP RIGHT SECTION
                    ================================= */}

                    <div className="hidden items-center gap-3 lg:flex">


                        {/* ADMIN */}

                        <Link
                            to="/admin/login"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            Admin
                        </Link>



                        {/* AUTH LOADING */}

                        {customerLoading ? (

                            <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-100" />

                        ) : customer ? (


                            /* =================================
                                 CUSTOMER PROFILE
                            ================================= */

                            <div
                                ref={
                                    profileRef
                                }
                                className="relative"
                            >


                                <button
                                    type="button"
                                    onClick={() => {

                                        setProfileOpen(
                                            (current) =>
                                                !current
                                        );

                                        setCategoryOpen(
                                            false
                                        );

                                    }}
                                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 transition hover:border-pink-200 hover:bg-pink-50"
                                >


                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm font-bold uppercase text-pink-700">

                                        {customer.name
                                            ?.charAt(
                                                0
                                            ) ||
                                            "U"}

                                    </div>


                                    <div className="max-w-32 text-left">


                                        <p className="truncate text-sm font-bold text-gray-900">

                                            {
                                                customer.name
                                            }

                                        </p>


                                        <p className="text-[10px] font-medium text-green-600">
                                            Logged in
                                        </p>


                                    </div>


                                    <span
                                        className={`text-xs text-gray-400 transition-transform ${
                                            profileOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    >
                                        ▼
                                    </span>


                                </button>



                                {/* PROFILE DROPDOWN */}

                                {profileOpen && (

                                    <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">


                                        <div className="border-b border-gray-100 p-5">


                                            <div className="flex items-center gap-3">


                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 text-lg font-bold uppercase text-pink-700">

                                                    {customer.name
                                                        ?.charAt(
                                                            0
                                                        ) ||
                                                        "U"}

                                                </div>


                                                <div className="min-w-0">


                                                    <p className="truncate font-bold text-gray-900">
                                                        {
                                                            customer.name
                                                        }
                                                    </p>


                                                    {customer.phone && (

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            +91{" "}
                                                            {
                                                                customer.phone
                                                            }
                                                        </p>

                                                    )}


                                                </div>


                                            </div>


                                        </div>



                                        <div className="p-2">


                                            <Link
                                                to="/products"
                                                className="block rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-pink-600"
                                            >
                                                🛍️ Browse Products
                                            </Link>


                                            <button
                                                type="button"
                                                onClick={
                                                    handleLogout
                                                }
                                                className="mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                ↪ Logout
                                            </button>


                                        </div>


                                    </div>

                                )}


                            </div>


                        ) : (


                            /* LOGIN */

                            <Link
                                to="/login"
                                state={{
                                    from:
                                        location.pathname
                                }}
                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-pink-600"
                            >
                                Customer Login
                            </Link>


                        )}


                    </div>



                    {/* =================================
                          MOBILE MENU BUTTON
                    ================================= */}

                    <button
                        type="button"
                        aria-label="Toggle navigation"
                        onClick={() =>
                            setMobileMenuOpen(
                                (current) =>
                                    !current
                            )
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
                    >

                        {mobileMenuOpen
                            ? "✕"
                            : "☰"}

                    </button>


                </div>



                {/* =================================
                       MOBILE MENU
                ================================= */}

                {mobileMenuOpen && (

                    <div className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-gray-100 bg-white px-4 py-5 lg:hidden">


                        <div className="mx-auto max-w-7xl">


                            {/* CUSTOMER */}

                            {customerLoading ? (

                                <div className="mb-5 h-16 animate-pulse rounded-xl bg-gray-100" />

                            ) : customer ? (

                                <div className="mb-5 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-4">


                                    <div className="flex items-center gap-3">


                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">

                                            {customer.name
                                                ?.charAt(
                                                    0
                                                ) ||
                                                "U"}

                                        </div>


                                        <div className="min-w-0">


                                            <p className="truncate font-bold text-gray-900">
                                                {
                                                    customer.name
                                                }
                                            </p>


                                            <p className="mt-1 text-xs font-medium text-green-600">
                                                ✓ Logged in
                                            </p>


                                        </div>


                                    </div>


                                </div>

                            ) : (

                                <Link
                                    to="/login"
                                    state={{
                                        from:
                                            location.pathname
                                    }}
                                    className="mb-5 block rounded-xl bg-gray-900 px-5 py-3.5 text-center font-bold text-white transition hover:bg-pink-600"
                                >
                                    Customer Login
                                </Link>

                            )}



                            {/* MAIN LINKS */}

                            <nav className="space-y-1">


                                <NavLink
                                    to="/"
                                    end
                                    className={({
                                        isActive
                                    }) =>
                                        `block rounded-xl px-4 py-3 font-semibold transition ${
                                            isActive
                                                ? "bg-pink-50 text-pink-600"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    Home
                                </NavLink>


                                <NavLink
                                    to="/products"
                                    className={({
                                        isActive
                                    }) =>
                                        `block rounded-xl px-4 py-3 font-semibold transition ${
                                            isActive
                                                ? "bg-pink-50 text-pink-600"
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    Products
                                </NavLink>


                            </nav>



                            {/* =================================
                               MOBILE CATEGORIES
                            ================================= */}

                            <div className="mt-5 border-t border-gray-100 pt-5">


                                <p className="mb-3 px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Categories
                                </p>


                                <div className="space-y-2">


                                    {Object.entries(
                                        categories
                                    ).map(
                                        ([
                                            category,
                                            subCategories
                                        ]) => {

                                        const isOpen =
                                            mobileCategory ===
                                            category;


                                        return (

                                            <div
                                                key={
                                                    category
                                                }
                                                className="overflow-hidden rounded-xl border border-gray-100"
                                            >


                                                <div className="flex items-center">


                                                    <Link
                                                        to={
                                                            getCategoryPath(
                                                                category
                                                            )
                                                        }
                                                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:text-pink-600"
                                                    >
                                                        {
                                                            category
                                                        }
                                                    </Link>


                                                    <button
                                                        type="button"
                                                        aria-label={`Show ${category} subcategories`}
                                                        onClick={() =>
                                                            setMobileCategory(
                                                                isOpen
                                                                    ? null
                                                                    : category
                                                            )
                                                        }
                                                        className="px-4 py-3 text-sm text-gray-400"
                                                    >

                                                        {isOpen
                                                            ? "−"
                                                            : "+"}

                                                    </button>


                                                </div>



                                                {isOpen && (

                                                    <div className="border-t border-gray-100 bg-gray-50 p-3">


                                                        <div className="flex flex-wrap gap-2">


                                                            {subCategories.map(
                                                                (
                                                                    subCategory
                                                                ) => (

                                                                <Link
                                                                    key={
                                                                        subCategory
                                                                    }
                                                                    to={
                                                                        getSubCategoryPath(
                                                                            category,
                                                                            subCategory
                                                                        )
                                                                    }
                                                                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-pink-100 hover:text-pink-700"
                                                                >
                                                                    {
                                                                        subCategory
                                                                    }
                                                                </Link>

                                                                )
                                                            )}


                                                        </div>


                                                    </div>

                                                )}


                                            </div>

                                        );

                                        }
                                    )}


                                </div>


                            </div>



                            {/* =================================
                                MOBILE AUTH ACTIONS
                            ================================= */}

                            <div className="mt-6 border-t border-gray-100 pt-5">


                                {customer && (

                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                        className="w-full rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                                    >
                                        Logout
                                    </button>

                                )}


                                <Link
                                    to="/admin/login"
                                    className="mt-3 block rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                                >
                                    Admin Portal
                                </Link>


                            </div>


                        </div>


                    </div>

                )}


            </header>

        </>

    );

}

export default Navbar;