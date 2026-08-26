import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState("");

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products", {
                params: {
                    limit: 50
                }
            });

            setProducts(response.data.products || []);

        } catch (error) {
            console.error("Failed to fetch products:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load products."
            );

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const query = search.toLowerCase().trim();

            const matchesSearch =
                !query ||
                product.name?.toLowerCase().includes(query) ||
                product.brand?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.subCategory?.toLowerCase().includes(query);

            const matchesStock =
                !stockFilter ||
                product.stockStatus === stockFilter;

            return matchesSearch && matchesStock;
        });
    }, [
        products,
        search,
        stockFilter
    ]);


    const handleDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        try {
            setDeleting(true);

            await api.delete(
                `/products/${deleteTarget._id}`
            );

            setProducts((currentProducts) =>
                currentProducts.filter(
                    (product) =>
                        product._id !== deleteTarget._id
                )
            );

            setDeleteTarget(null);

        } catch (error) {
            console.error("Delete failed:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete product."
            );

        } finally {
            setDeleting(false);
        }
    };


    return (
        <AdminLayout>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

                <div>

                    <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                        Products
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                        Product Management
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage all products available in your shop.
                    </p>

                </div>


                <Link
                    to="/admin/products/add"
                    className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                >
                    + Add Product
                </Link>

            </div>


            {/* Filters */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">

                    <input
                        type="text"
                        placeholder="Search name, brand, category..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />


                    <select
                        value={stockFilter}
                        onChange={(e) =>
                            setStockFilter(
                                e.target.value
                            )
                        }
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                    >
                        <option value="">
                            All Stock
                        </option>

                        <option value="in-stock">
                            In Stock
                        </option>

                        <option value="out-of-stock">
                            Out of Stock
                        </option>

                    </select>


                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setStockFilter("");
                        }}
                        className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                        Clear
                    </button>

                </div>

            </div>


            {/* Error */}
            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                    {error}
                </div>
            )}


            {/* Product Card */}
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            All Products
                        </h2>

                        {!loading && (
                            <p className="mt-1 text-sm text-gray-500">
                                {filteredProducts.length} products shown
                            </p>
                        )}

                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="space-y-4 p-6">

                        {[1, 2, 3, 4, 5].map((item) => (

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

                        ))}

                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    filteredProducts.length === 0 && (

                    <div className="px-6 py-20 text-center">

                        <div className="text-4xl">
                            📦
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-gray-900">
                            No products found
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Try changing your filters or add a new product.
                        </p>

                        <Link
                            to="/admin/products/add"
                            className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                        >
                            Add Product
                        </Link>

                    </div>

                )}


                {/* Table */}
                {!loading &&
                    filteredProducts.length > 0 && (

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
                                        Stock
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Featured
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredProducts.map(
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
                                                        className="h-14 w-14 rounded-xl border border-gray-200 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xl">
                                                        📦
                                                    </div>

                                                )}


                                                <div>

                                                    <p className="max-w-56 truncate font-semibold text-gray-900">
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


                                        <td className="px-6 py-4">

                                            <p className="text-sm font-medium text-gray-700">
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


                                        <td className="px-6 py-4">

                                            {product.featured ? (

                                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    Featured
                                                </span>

                                            ) : (

                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                                                >
                                                    Edit
                                                </Link>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            product
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* Delete Confirmation Modal */}
            {deleteTarget && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                            ⚠️
                        </div>


                        <h2 className="mt-5 text-2xl font-bold text-gray-900">
                            Delete product?
                        </h2>


                        <p className="mt-3 leading-6 text-gray-500">
                            You're about to permanently delete{" "}
                            <span className="font-semibold text-gray-900">
                                {deleteTarget.name}
                            </span>
                            .
                        </p>


                        <p className="mt-2 text-sm text-red-600">
                            Its associated Cloudinary images will also be deleted.
                        </p>


                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={deleting}
                                onClick={handleDelete}
                                className="flex items-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >

                                {deleting
                                    ? "Deleting..."
                                    : "Delete Product"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </AdminLayout>
    );
}

export default ProductList;