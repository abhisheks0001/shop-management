import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../api/api";
import AdminLayout from "../../layouts/AdminLayout";

function ProductList() {

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [
        stockFilter,
        setStockFilter
    ] = useState("");

    const [
        deleteTarget,
        setDeleteTarget
    ] = useState(null);

    const [
        deleting,
        setDeleting
    ] = useState(false);


    // ============================================
    // FETCH PRODUCTS
    // ============================================

    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/products",
                    {
                        params: {
                            limit: 50,
                            sort: "newest"
                        }
                    }
                );

            setProducts(
                response.data.products || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch products:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Unable to load products.";

            setError(message);

            toast.error(message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProducts();

    }, []);


    // ============================================
    // FILTER PRODUCTS LOCALLY
    // ============================================

    const filteredProducts =
        useMemo(() => {

            return products.filter(
                (product) => {

                    const query =
                        search
                            .trim()
                            .toLowerCase();


                    const matchesSearch =
                        !query ||

                        product.name
                            ?.toLowerCase()
                            .includes(query) ||

                        product.brand
                            ?.toLowerCase()
                            .includes(query) ||

                        product.category
                            ?.toLowerCase()
                            .includes(query) ||

                        product.subCategory
                            ?.toLowerCase()
                            .includes(query);


                    const matchesStock =
                        !stockFilter ||
                        product.stockStatus ===
                            stockFilter;


                    return (
                        matchesSearch &&
                        matchesStock
                    );

                }
            );

        }, [
            products,
            search,
            stockFilter
        ]);


    // ============================================
    // OPEN DELETE MODAL
    // ============================================

    const openDeleteModal = (
        product
    ) => {

        setDeleteTarget(product);

    };


    // ============================================
    // CLOSE DELETE MODAL
    // ============================================

    const closeDeleteModal = () => {

        if (deleting) {
            return;
        }

        setDeleteTarget(null);

    };


    // ============================================
    // DELETE PRODUCT
    // ============================================

    const handleDelete = async () => {

        if (!deleteTarget) {
            return;
        }


        try {

            setDeleting(true);


            /*
                Backend DELETE flow:

                adminAuth
                    ↓
                Find product
                    ↓
                Delete Cloudinary images
                    ↓
                Delete MongoDB product
            */

            await api.delete(
                `/products/${deleteTarget._id}`
            );


            /*
                Remove product from React UI
                without requesting all products again.
            */

            setProducts(
                (currentProducts) =>
                    currentProducts.filter(
                        (product) =>
                            product._id !==
                            deleteTarget._id
                    )
            );


            toast.success(
                `${deleteTarget.name} deleted successfully`
            );


            setDeleteTarget(null);


        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            toast.error(
                error.response?.data?.message ||
                "Unable to delete product."
            );


        } finally {

            setDeleting(false);

        }

    };


    // ============================================
    // CLEAR FILTERS
    // ============================================

    const handleClearFilters = () => {

        setSearch("");
        setStockFilter("");

    };


    return (

        <AdminLayout>

            {/* =================================
                    PAGE HEADER
            ================================= */}

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

                <div>

                    <p className="text-sm font-bold uppercase tracking-wider text-pink-600">
                        Products
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                        Product Management
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Search, edit and manage products
                        available in your store.
                    </p>

                </div>


                <Link
                    to="/admin/products/add"
                    className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-600"
                >
                    + Add Product
                </Link>

            </div>


            {/* =================================
                     FILTERS
            ================================= */}

            <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">


                <div className="grid gap-4 md:grid-cols-[1fr_220px_auto]">


                    {/* Search */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Search
                        </label>

                        <div className="relative">

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search name, brand or category..."
                                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                            />


                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                                >
                                    ✕
                                </button>

                            )}

                        </div>

                    </div>


                    {/* Stock Filter */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Availability
                        </label>

                        <select
                            value={
                                stockFilter
                            }
                            onChange={(e) =>
                                setStockFilter(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                        >

                            <option value="">
                                All Products
                            </option>

                            <option value="in-stock">
                                In Stock
                            </option>

                            <option value="out-of-stock">
                                Out of Stock
                            </option>

                        </select>

                    </div>


                    {/* Clear */}

                    <div className="flex items-end">

                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white md:w-auto"
                        >
                            Clear
                        </button>

                    </div>

                </div>


                <div className="mt-4 border-t border-gray-100 pt-4">

                    {!loading && (

                        <p className="text-sm text-gray-500">

                            Showing{" "}
                            <span className="font-semibold text-gray-900">
                                {
                                    filteredProducts.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-gray-900">
                                {products.length}
                            </span>{" "}
                            products

                        </p>

                    )}

                </div>

            </section>


            {/* =================================
                    ERROR
            ================================= */}

            {error && (

                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">

                    <p className="font-semibold text-red-700">
                        Unable to load products
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchProducts
                        }
                        className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================
                   PRODUCT TABLE CARD
            ================================= */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">


                {/* Table Heading */}

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            All Products
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Products currently stored in
                            your catalogue.
                        </p>

                    </div>


                    {!loading && (

                        <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">

                            {
                                filteredProducts.length
                            }{" "}
                            products

                        </span>

                    )}

                </div>


                {/* =================================
                        LOADING
                ================================= */}

                {loading && (

                    <div className="space-y-4 p-6">

                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ].map(
                            (item) => (

                            <div
                                key={item}
                                className="flex items-center gap-4"
                            >

                                <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-gray-200" />

                                <div className="flex-1 space-y-2">

                                    <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />

                                    <div className="h-3 w-1/4 animate-pulse rounded bg-gray-200" />

                                </div>


                                <div className="hidden h-8 w-20 animate-pulse rounded bg-gray-200 md:block" />

                            </div>

                            )
                        )}

                    </div>

                )}


                {/* =================================
                    EMPTY FILTER RESULT
                ================================= */}

                {!loading &&
                    filteredProducts.length ===
                        0 && (

                    <div className="px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                            📦
                        </div>


                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                            No products found
                        </h3>


                        {products.length > 0 ? (

                            <>
                                <p className="mt-2 text-gray-500">
                                    No products match your
                                    current search or filter.
                                </p>

                                <button
                                    type="button"
                                    onClick={
                                        handleClearFilters
                                    }
                                    className="mt-6 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                                >
                                    Clear Filters
                                </button>
                            </>

                        ) : (

                            <>
                                <p className="mt-2 text-gray-500">
                                    Your shop catalogue is
                                    currently empty.
                                </p>

                                <Link
                                    to="/admin/products/add"
                                    className="mt-6 inline-block rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-pink-600"
                                >
                                    Add First Product
                                </Link>
                            </>

                        )}

                    </div>

                )}


                {/* =================================
                    DESKTOP TABLE
                ================================= */}

                {!loading &&
                    filteredProducts.length >
                        0 && (

                    <div className="hidden overflow-x-auto md:block">

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
                                        key={
                                            product._id
                                        }
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
                                                        className="h-14 w-14 shrink-0 rounded-xl border border-gray-200 object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                                                        📦
                                                    </div>

                                                )}


                                                <div className="min-w-0">

                                                    <p className="max-w-56 truncate font-semibold text-gray-900">
                                                        {
                                                            product.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 max-w-44 truncate text-xs text-gray-400">
                                                        {
                                                            product.brand ||
                                                            "No brand"
                                                        }
                                                    </p>

                                                </div>


                                            </div>

                                        </td>


                                        {/* Category */}

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


                                        {/* Price */}

                                        <td className="px-6 py-4">

                                            <p className="font-bold text-gray-900">
                                                ₹
                                                {
                                                    product.price
                                                }
                                            </p>

                                        </td>


                                        {/* Stock */}

                                        <td className="px-6 py-4">

                                            {product.stockStatus ===
                                            "in-stock" ? (

                                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                                    In Stock

                                                </span>

                                            ) : (

                                                <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                                                    Out of Stock

                                                </span>

                                            )}

                                        </td>


                                        {/* Featured */}

                                        <td className="px-6 py-4">

                                            {product.featured ? (

                                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    ★ Featured
                                                </span>

                                            ) : (

                                                <span className="text-sm text-gray-400">
                                                    —
                                                </span>

                                            )}

                                        </td>


                                        {/* Actions */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center justify-end gap-2">


                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                                                >
                                                    Edit
                                                </Link>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            product
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
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


                {/* =================================
                       MOBILE CARDS
                ================================= */}

                {!loading &&
                    filteredProducts.length >
                        0 && (

                    <div className="divide-y divide-gray-100 md:hidden">

                        {filteredProducts.map(
                            (product) => (

                            <article
                                key={
                                    product._id
                                }
                                className="p-5"
                            >


                                <div className="flex gap-4">


                                    {product.images?.[0] ? (

                                        <img
                                            src={
                                                product.images[0]
                                            }
                                            alt={
                                                product.name
                                            }
                                            className="h-20 w-20 shrink-0 rounded-xl border border-gray-200 object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                                            📦
                                        </div>

                                    )}


                                    <div className="min-w-0 flex-1">

                                        <p className="truncate font-bold text-gray-900">
                                            {
                                                product.name
                                            }
                                        </p>

                                        <p className="mt-1 text-sm text-gray-400">
                                            {product.brand ||
                                                "No brand"}
                                        </p>

                                        <p className="mt-2 text-lg font-bold text-gray-900">
                                            ₹
                                            {
                                                product.price
                                            }
                                        </p>

                                    </div>


                                </div>


                                <div className="mt-4 flex flex-wrap gap-2">


                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                        {
                                            product.category
                                        }
                                    </span>


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


                                    {product.featured && (

                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                            ★ Featured
                                        </span>

                                    )}


                                </div>


                                <div className="mt-5 grid grid-cols-2 gap-3">


                                    <Link
                                        to={`/admin/products/edit/${product._id}`}
                                        className="rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                    >
                                        Edit
                                    </Link>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDeleteModal(
                                                product
                                            )
                                        }
                                        className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>


                                </div>


                            </article>

                            )
                        )}

                    </div>

                )}


            </section>


            {/* =================================
               DELETE CONFIRMATION MODAL
            ================================= */}

            {deleteTarget && (

                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            closeDeleteModal();
                        }

                    }}
                >


                    <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">


                        {/* Warning icon */}

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
                            ⚠️
                        </div>


                        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-red-600">
                            Permanent Action
                        </p>


                        <h2 className="mt-2 text-2xl font-bold text-gray-900">
                            Delete product?
                        </h2>


                        <p className="mt-3 leading-7 text-gray-500">

                            You're about to permanently
                            delete{" "}

                            <span className="font-semibold text-gray-900">
                                {
                                    deleteTarget.name
                                }
                            </span>

                            .

                        </p>


                        {/* Product preview */}

                        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gray-50 p-4">


                            {deleteTarget.images?.[0] ? (

                                <img
                                    src={
                                        deleteTarget.images[0]
                                    }
                                    alt={
                                        deleteTarget.name
                                    }
                                    className="h-14 w-14 rounded-xl object-cover"
                                />

                            ) : (

                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200">
                                    📦
                                </div>

                            )}


                            <div className="min-w-0">

                                <p className="truncate font-semibold text-gray-900">
                                    {
                                        deleteTarget.name
                                    }
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    ₹
                                    {
                                        deleteTarget.price
                                    }
                                </p>

                            </div>


                        </div>


                        {/* Warning */}

                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

                            <p className="text-sm font-semibold text-red-700">
                                This cannot be undone.
                            </p>

                            <p className="mt-1 text-sm leading-6 text-red-600">
                                The product will be removed
                                from MongoDB and its
                                associated Cloudinary
                                images will also be deleted.
                            </p>

                        </div>


                        {/* Buttons */}

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">


                            <button
                                type="button"
                                disabled={
                                    deleting
                                }
                                onClick={
                                    closeDeleteModal
                                }
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                disabled={
                                    deleting
                                }
                                onClick={
                                    handleDelete
                                }
                                className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {deleting ? (

                                    <>
                                        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                        Deleting...
                                    </>

                                ) : (

                                    "Delete Product"

                                )}

                            </button>


                        </div>


                    </div>


                </div>

            )}


        </AdminLayout>

    );

}

export default ProductList;