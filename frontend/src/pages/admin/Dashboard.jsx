import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";
import { useAdminAuth } from "../../context/AdminAuthContext";

function Dashboard() {
    const { admin } = useAdminAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products");

                setProducts(
                    response.data.products || []
                );

            } catch (error) {
                console.error(
                    "Dashboard error:",
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

        fetchDashboardData();

    }, []);


    const totalProducts = products.length;

    const inStockProducts =
        products.filter(
            (product) =>
                product.stockStatus === "in-stock"
        ).length;

    const outOfStockProducts =
        products.filter(
            (product) =>
                product.stockStatus === "out-of-stock"
        ).length;

    const featuredProducts =
        products.filter(
            (product) => product.featured
        ).length;


    const recentProducts =
        products.slice(0, 5);


    const stats = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: "📦",
            description: "Products in your store"
        },

        {
            title: "In Stock",
            value: inStockProducts,
            icon: "✓",
            description: "Currently available"
        },

        {
            title: "Out of Stock",
            value: outOfStockProducts,
            icon: "!",
            description: "Need attention"
        },

        {
            title: "Featured",
            value: featuredProducts,
            icon: "★",
            description: "Highlighted products"
        }
    ];


    return (
        <AdminLayout>

            {/* ========================
                PAGE HEADER
            ======================== */}

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
                        Here's what's happening with
                        your shop.
                    </p>

                </div>


                <Link
                    to="/admin/products/add"
                    className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-600"
                >
                    + Add Product
                </Link>

            </div>


            {/* ========================
                    ERROR
            ======================== */}

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


            {/* ========================
                STATISTICS
            ======================== */}

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map((stat) => (

                    <div
                        key={stat.title}
                        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-semibold text-gray-500">
                                    {stat.title}
                                </p>

                                {loading ? (

                                    <div className="mt-3 h-10 w-16 animate-pulse rounded bg-gray-200" />

                                ) : (

                                    <p className="mt-2 text-4xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>

                                )}

                            </div>


                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                                {stat.icon}
                            </div>

                        </div>


                        <p className="mt-4 text-sm text-gray-400">
                            {stat.description}
                        </p>

                    </div>

                ))}

            </div>


            {/* ========================
                  QUICK ACTIONS
            ======================== */}

            <section className="mt-8">

                <div className="mb-4">

                    <h2 className="text-xl font-bold text-gray-900">
                        Quick Actions
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Common shop management tasks.
                    </p>

                </div>


                <div className="grid gap-4 md:grid-cols-3">

                    <Link
                        to="/admin/products/add"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-pink-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-xl">
                            +
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-pink-600">
                            Add Product
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Add a new product to your
                            shop catalogue.
                        </p>

                    </Link>


                    <Link
                        to="/admin/products"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-pink-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
                            📦
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-pink-600">
                            Manage Products
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            View, edit or remove existing
                            products.
                        </p>

                    </Link>


                    <Link
                        to="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-pink-200 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-xl">
                            ↗
                        </div>

                        <h3 className="mt-5 font-bold text-gray-900 transition group-hover:text-pink-600">
                            View Store
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Open the customer-facing shop
                            in a new tab.
                        </p>

                    </Link>

                </div>

            </section>


            {/* ========================
                RECENT PRODUCTS
            ======================== */}

            <section className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">

                {/* Table Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Recent Products
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Recently added products in
                            your shop.
                        </p>

                    </div>


                    <Link
                        to="/admin/products"
                        className="text-sm font-semibold text-pink-600 hover:text-pink-700"
                    >
                        View all →
                    </Link>

                </div>


                {/* Loading */}
                {loading && (

                    <div className="space-y-4 p-6">

                        {[1, 2, 3, 4].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="flex items-center gap-4"
                                >

                                    <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-200" />

                                    <div className="flex-1">

                                        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />

                                        <div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-gray-200" />

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* Empty */}
                {!loading &&
                    recentProducts.length === 0 && (

                    <div className="px-6 py-16 text-center">

                        <div className="text-4xl">
                            📦
                        </div>

                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            No products yet
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Start by adding your first
                            product.
                        </p>

                        <Link
                            to="/admin/products/add"
                            className="mt-5 inline-block rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600"
                        >
                            Add Product
                        </Link>

                    </div>

                )}


                {/* Desktop Table */}
                {!loading &&
                    recentProducts.length > 0 && (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Stock
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

                                        {/* Product */}
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
                                                        className="h-12 w-12 rounded-xl object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                                        📦
                                                    </div>

                                                )}


                                                <div>

                                                    <p className="max-w-52 truncate font-semibold text-gray-900">
                                                        {
                                                            product.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {
                                                            product.brand ||
                                                            "No brand"
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Category */}
                                        <td className="px-6 py-4 text-sm text-gray-600">

                                            <p>
                                                {
                                                    product.category
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {
                                                    product.subCategory
                                                }
                                            </p>

                                        </td>


                                        {/* Price */}
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            ₹{product.price}
                                        </td>


                                        {/* Stock */}
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


                                        {/* Action */}
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

                )}

            </section>

        </AdminLayout>
    );
}

export default Dashboard;