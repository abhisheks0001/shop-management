import { useEffect, useState } from "react";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/Productcard";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const [sort, setSort] = useState("newest");
    const [stockStatus, setStockStatus] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products", {
                    params: {
                        search: search || undefined,
                        page,
                        limit: 8,
                        sort,
                        stockStatus: stockStatus || undefined,
                        minPrice: minPrice || undefined,
                        maxPrice: maxPrice || undefined
                    }
                });

                setProducts(response.data.products || []);
                setPagination(response.data.pagination || null);

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

        fetchProducts();

    }, [
        search,
        page,
        sort,
        stockStatus,
        minPrice,
        maxPrice
    ]);

    const handleClearFilters = () => {
        setSearch("");
        setSort("newest");
        setStockStatus("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    return (
        <CustomerLayout>

            {/* Page Header */}
            <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">

                    <p className="font-semibold text-pink-600">
                        Our Collection
                    </p>

                    <h1 className="mt-2 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Find products for your everyday needs.
                    </h1>

                    <p className="mt-4 max-w-2xl text-gray-600">
                        Explore cosmetics, personal care, household products
                        and everyday essentials available from our shop.
                    </p>

                </div>
            </section>


            {/* Products Section */}
            <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">

                {/* Search */}
                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="Search products, brands or categories..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-3.5 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                    />

                </div>


                {/* Filters */}
                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* Sort */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Sort by
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            >
                                <option value="newest">
                                    Newest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>

                            </select>
                        </div>


                        {/* Stock */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Availability
                            </label>

                            <select
                                value={stockStatus}
                                onChange={(e) => {
                                    setStockStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            >
                                <option value="">
                                    All products
                                </option>

                                <option value="in-stock">
                                    In Stock
                                </option>

                                <option value="out-of-stock">
                                    Out of Stock
                                </option>
                            </select>
                        </div>


                        {/* Minimum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Minimum price
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="₹0"
                                value={minPrice}
                                onChange={(e) => {
                                    setMinPrice(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            />
                        </div>


                        {/* Maximum Price */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Maximum price
                            </label>

                            <input
                                type="number"
                                min="0"
                                placeholder="₹1000"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            />
                        </div>

                    </div>


                    {/* Clear Filters */}
                    <div className="mt-5 flex justify-end">

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                            Clear filters
                        </button>

                    </div>

                </div>


                {/* Products Heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Products
                        </h2>

                        {!loading && pagination && (
                            <p className="mt-1 text-sm text-gray-500">
                                {pagination.totalProducts} products found
                            </p>
                        )}

                    </div>

                    {pagination && (
                        <p className="text-sm font-medium text-gray-500">
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </p>
                    )}

                </div>


                {/* Loading */}
                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-gray-200" />

                                <div className="space-y-3 p-5">
                                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                    <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}

                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">

                        <h3 className="text-lg font-semibold text-red-700">
                            Something went wrong
                        </h3>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                    </div>
                )}


                {/* No Products */}
                {!loading && !error && products.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                            🔍
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                            No products found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">
                            Try changing your search, price range or
                            availability filters.
                        </p>

                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="mt-6 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                        >
                            Clear filters
                        </button>

                    </div>
                )}


                {/* Products Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}

                    </div>
                )}


                {/* Pagination */}
                {!loading &&
                    !error &&
                    pagination &&
                    pagination.totalPages > 1 && (

                    <div className="mt-14 flex flex-wrap items-center justify-center gap-3">

                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => {
                                setPage((prev) => prev - 1);

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }}
                            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ← Previous
                        </button>


                        <div className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700">
                            {pagination.currentPage}
                            {" / "}
                            {pagination.totalPages}
                        </div>


                        <button
                            type="button"
                            disabled={
                                page === pagination.totalPages
                            }
                            onClick={() => {
                                setPage((prev) => prev + 1);

                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });
                            }}
                            className="rounded-full bg-gray-900 px-5 py-2.5 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next →
                        </button>

                    </div>
                )}

            </section>

        </CustomerLayout>
    );
}

export default Products;