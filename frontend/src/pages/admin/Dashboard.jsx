import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";

function Dashboard() {
    const { admin } = useAdminAuth();

    const [stats, setStats] = useState({
        totalVisitors: 0,
        totalVisits: 0,
        totalCustomers: 0,
        totalProducts: 0,
        dashboardVisits: 0,

        todayVisitors: 0,
        activeVisitorsToday: 0,
        customersLoggedInToday: 0,
        productViewsToday: 0,

        activeVisitorsThisWeek: 0,
        customersLoggedInThisWeek: 0,
        productViewsThisWeek: 0,

        activeVisitorsThisMonth: 0,
        customersLoggedInThisMonth: 0,
        productViewsThisMonth: 0,

        mostViewedProducts: [],
        mostViewedCategories: [],
        latestCustomers: []
    });

    const [recentProducts, setRecentProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                /*
                    Record dashboard opening.

                    During development React StrictMode may run
                    this effect twice, so dashboardVisits can
                    increase twice locally.
                */
                try {
                    await api.post("/dashboard/visit");
                } catch (visitError) {
                    console.error(
                        "Failed to record dashboard visit:",
                        visitError
                    );
                }

                const [
                    statsResponse,
                    productsResponse
                ] = await Promise.all([
                    api.get("/dashboard/stats"),

                    api.get("/products", {
                        params: {
                            page: 1,
                            limit: 5,
                            sort: "newest"
                        }
                    })
                ]);

                setStats((current) => ({
                    ...current,
                    ...statsResponse.data
                }));

                setRecentProducts(
                    productsResponse.data.products || []
                );

            } catch (error) {
                console.error(
                    "Dashboard loading error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard."
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, []);


    const mainStats = [
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: "📦",
            description: "Products currently in your store"
        },
        {
            title: "Customers",
            value: stats.totalCustomers,
            icon: "👥",
            description: "Customers who completed login"
        },
        {
            title: "Visitors",
            value: stats.totalVisitors,
            icon: "🌐",
            description: "Unique browser visitors"
        },
        {
            title: "Views Today",
            value: stats.productViewsToday,
            icon: "👁",
            description: "Product detail views today"
        }
    ];


    const todayStats = [
        {
            title: "New Visitors",
            value: stats.todayVisitors
        },
        {
            title: "Active Visitors",
            value: stats.activeVisitorsToday
        },
        {
            title: "Customer Logins",
            value: stats.customersLoggedInToday
        },
        {
            title: "Product Views",
            value: stats.productViewsToday
        }
    ];


    const weekStats = [
        {
            title: "Active Visitors",
            value: stats.activeVisitorsThisWeek
        },
        {
            title: "Customer Logins",
            value: stats.customersLoggedInThisWeek
        },
        {
            title: "Product Views",
            value: stats.productViewsThisWeek
        }
    ];


    const monthStats = [
        {
            title: "Active Visitors",
            value: stats.activeVisitorsThisMonth
        },
        {
            title: "Customer Logins",
            value: stats.customersLoggedInThisMonth
        },
        {
            title: "Product Views",
            value: stats.productViewsThisMonth
        }
    ];


    return (
        <AdminLayout>

            {/* =========================
                    PAGE HEADER
            ========================== */}

            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">

                <div>

                    <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                        Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                        Welcome back
                        {admin?.name
                            ? `, ${admin.name}`
                            : ""}
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Monitor your store, products and
                        customer activity from one place.
                    </p>

                </div>


                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        View Store ↗
                    </Link>

                    <Link
                        to="/admin/products/add"
                        className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-600"
                    >
                        + Add Product
                    </Link>

                </div>

            </div>


            {/* =========================
                       ERROR
            ========================== */}

            {error && (

                <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <p className="font-semibold text-red-700">
                        Dashboard loading failed
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                </div>

            )}


            {/* =========================
                  MAIN STAT CARDS
            ========================== */}

            <section>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {mainStats.map((stat) => (

                        <div
                            key={stat.title}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-gray-500">
                                        {stat.title}
                                    </p>


                                    {loading ? (

                                        <div className="mt-3 h-10 w-20 animate-pulse rounded bg-gray-200" />

                                    ) : (

                                        <p className="mt-2 text-4xl font-bold text-gray-900">
                                            {stat.value || 0}
                                        </p>

                                    )}

                                </div>


                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                                    {stat.icon}
                                </div>

                            </div>


                            <p className="mt-4 text-sm leading-6 text-gray-400">
                                {stat.description}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* =========================
                   QUICK ACTIONS
            ========================== */}

            <section className="mt-8">

                <div className="mb-5">

                    <h2 className="text-xl font-bold text-gray-900">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Common shop-management tasks.
                    </p>

                </div>


                <div className="grid gap-4 md:grid-cols-3">

                    <Link
                        to="/admin/products/add"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-xl">
                            +
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-pink-600">
                            Add Product
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Add a new product with categories,
                            availability and Cloudinary images.
                        </p>

                    </Link>


                    <Link
                        to="/admin/products"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
                            📦
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-purple-600">
                            Manage Products
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Search, edit or safely delete
                            existing products.
                        </p>

                    </Link>


                    <Link
                        to="/products"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                            🛍️
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-green-600">
                            Customer Store
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Check what customers currently see
                            on your product catalogue.
                        </p>

                    </Link>

                </div>

            </section>


            {/* =========================
                  TODAY ANALYTICS
            ========================== */}

            <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <div className="mb-6">

                    <p className="text-sm font-semibold text-pink-600">
                        Today
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                        Today's Activity
                    </h2>

                </div>


                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {todayStats.map((item) => (

                        <div
                            key={item.title}
                            className="rounded-xl bg-gray-50 p-5"
                        >

                            <p className="text-sm font-medium text-gray-500">
                                {item.title}
                            </p>

                            {loading ? (

                                <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />

                            ) : (

                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                    {item.value || 0}
                                </p>

                            )}

                        </div>

                    ))}

                </div>

            </section>


            {/* =========================
                WEEK / MONTH
            ========================== */}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">

                {/* Week */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">

                        <p className="text-sm font-semibold text-purple-600">
                            Last 7 Days
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Weekly Activity
                        </h2>

                    </div>


                    <div className="space-y-3">

                        {weekStats.map((item) => (

                            <div
                                key={item.title}
                                className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4"
                            >

                                <span className="text-sm font-medium text-gray-600">
                                    {item.title}
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {loading
                                        ? "..."
                                        : item.value || 0}
                                </span>

                            </div>

                        ))}

                    </div>

                </section>


                {/* Month */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-5">

                        <p className="text-sm font-semibold text-blue-600">
                            Current Month
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Monthly Activity
                        </h2>

                    </div>


                    <div className="space-y-3">

                        {monthStats.map((item) => (

                            <div
                                key={item.title}
                                className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4"
                            >

                                <span className="text-sm font-medium text-gray-600">
                                    {item.title}
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {loading
                                        ? "..."
                                        : item.value || 0}
                                </span>

                            </div>

                        ))}

                    </div>

                </section>

            </div>


            {/* =========================
               MOST VIEWED PRODUCTS
            ========================== */}

            <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">

                    <div>

                        <p className="text-sm font-semibold text-pink-600">
                            Customer Interest
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Most Viewed Products
                        </h2>

                    </div>


                    <Link
                        to="/admin/products"
                        className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                        Manage products →
                    </Link>

                </div>


                {loading ? (

                    <div className="space-y-4 p-6">

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="h-16 animate-pulse rounded-xl bg-gray-100"
                            />

                        ))}

                    </div>

                ) : stats.mostViewedProducts?.length > 0 ? (

                    <div className="divide-y divide-gray-100">

                        {stats.mostViewedProducts.map(
                            (product, index) => (

                            <div
                                key={product._id}
                                className="flex flex-wrap items-center gap-4 px-6 py-5"
                            >

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                    {index + 1}
                                </div>


                                {product.images?.[0] ? (

                                    <img
                                        src={
                                            product.images[0]
                                        }
                                        alt={
                                            product.name
                                        }
                                        className="h-14 w-14 rounded-xl border border-gray-200 object-cover"
                                    />

                                ) : (

                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                                        📦
                                    </div>

                                )}


                                <div className="min-w-0 flex-1">

                                    <p className="truncate font-semibold text-gray-900">
                                        {product.name}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {product.category}
                                        {" • "}
                                        {product.subCategory}
                                    </p>

                                </div>


                                <div className="text-right">

                                    <p className="text-xl font-bold text-gray-900">
                                        {product.viewCount || 0}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        views
                                    </p>

                                </div>

                            </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="px-6 py-12 text-center text-gray-500">
                        No product-view data available yet.
                    </div>

                )}

            </section>


            {/* =========================
                   CATEGORY DATA
            ========================== */}

            <div className="mt-8 grid gap-6 xl:grid-cols-2">

                {/* Categories */}
                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <p className="text-sm font-semibold text-purple-600">
                            Categories
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Most Viewed Categories
                        </h2>

                    </div>


                    <div className="p-6">

                        {!loading &&
                        stats.mostViewedCategories?.length >
                            0 ? (

                            <div className="space-y-3">

                                {stats.mostViewedCategories.map(
                                    (
                                        category,
                                        index
                                    ) => (

                                    <div
                                        key={
                                            category._id ||
                                            category.category
                                        }
                                        className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4"
                                    >

                                        <div className="flex items-center gap-3">

                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                                                {index + 1}
                                            </span>

                                            <p className="font-semibold text-gray-800">
                                                {
                                                    category.category
                                                }
                                            </p>

                                        </div>


                                        <div className="text-right">

                                            <p className="font-bold text-gray-900">
                                                {
                                                    category.viewCount ||
                                                    0
                                                }
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                views
                                            </p>

                                        </div>

                                    </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className="py-10 text-center text-sm text-gray-500">
                                No category-view data available.
                            </div>

                        )}

                    </div>

                </section>


                {/* Lifetime Activity */}
                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <p className="text-sm font-semibold text-blue-600">
                            Lifetime
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Store Activity
                        </h2>

                    </div>


                    <div className="space-y-3 p-6">

                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">

                            <span className="text-sm font-medium text-gray-600">
                                Total Website Visits
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                                {stats.totalVisits || 0}
                            </span>

                        </div>


                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">

                            <span className="text-sm font-medium text-gray-600">
                                Unique Visitors
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                                {stats.totalVisitors || 0}
                            </span>

                        </div>


                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">

                            <span className="text-sm font-medium text-gray-600">
                                Registered Customers
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                                {stats.totalCustomers || 0}
                            </span>

                        </div>


                        <div className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">

                            <span className="text-sm font-medium text-gray-600">
                                Dashboard Opens
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                                {stats.dashboardVisits || 0}
                            </span>

                        </div>

                    </div>

                </section>

            </div>


            {/* =========================
                  RECENT PRODUCTS
            ========================== */}

            <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">

                    <div>

                        <p className="text-sm font-semibold text-green-600">
                            Catalogue
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Recent Products
                        </h2>

                    </div>


                    <Link
                        to="/admin/products"
                        className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                        View all →
                    </Link>

                </div>


                {loading ? (

                    <div className="space-y-4 p-6">

                        {[1, 2, 3, 4, 5].map(
                            (item) => (

                            <div
                                key={item}
                                className="flex items-center gap-4"
                            >

                                <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200" />

                                <div className="flex-1 space-y-2">

                                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />

                                    <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />

                                </div>

                            </div>

                            )
                        )}

                    </div>

                ) : recentProducts.length > 0 ? (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-gray-100 bg-gray-50">

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {recentProducts.map(
                                    (product) => (

                                    <tr
                                        key={product._id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-4">

                                                {product.images?.[0] ? (

                                                    <img
                                                        src={
                                                            product.images[0]
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="h-12 w-12 rounded-xl border border-gray-200 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                                        📦
                                                    </div>

                                                )}


                                                <div>

                                                    <p className="max-w-56 truncate font-semibold text-gray-900">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {product.brand ||
                                                            "No brand"}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className="px-6 py-4">

                                            <p className="text-sm font-medium text-gray-700">
                                                {product.category}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {product.subCategory}
                                            </p>

                                        </td>


                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₹{product.price}
                                        </td>


                                        <td className="px-6 py-4">

                                            {product.stockStatus ===
                                            "in-stock" ? (

                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    In Stock
                                                </span>

                                            ) : (

                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                    Out of Stock
                                                </span>

                                            )}

                                        </td>


                                        <td className="px-6 py-4 text-right">

                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                                            >
                                                Edit
                                            </Link>

                                        </td>

                                    </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="px-6 py-16 text-center">

                        <div className="text-4xl">
                            📦
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            No products yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Add your first product to start
                            building the catalogue.
                        </p>

                        <Link
                            to="/admin/products/add"
                            className="mt-5 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
                        >
                            Add Product
                        </Link>

                    </div>

                )}

            </section>


            {/* =========================
                 LATEST CUSTOMERS
            ========================== */}

            {stats.latestCustomers?.length > 0 && (

                <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">

                        <p className="text-sm font-semibold text-orange-600">
                            Customers
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Latest Customers
                        </h2>

                    </div>


                    <div className="divide-y divide-gray-100">

                        {stats.latestCustomers.map(
                            (customer) => (

                            <div
                                key={customer._id}
                                className="flex flex-wrap items-center gap-4 px-6 py-5"
                            >

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 font-bold uppercase text-pink-700">
                                    {customer.name?.charAt(0)}
                                </div>


                                <div className="min-w-0 flex-1">

                                    <p className="font-semibold text-gray-900">
                                        {customer.name}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-400">
                                        {customer.phone}
                                    </p>

                                </div>


                                {customer.createdAt && (

                                    <p className="text-sm text-gray-400">
                                        {new Date(
                                            customer.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                )}

                            </div>

                            )
                        )}

                    </div>

                </section>

            )}

        </AdminLayout>
    );
}

export default Dashboard;