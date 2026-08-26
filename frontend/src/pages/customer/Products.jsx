import {
    useEffect,
    useState
} from "react";

import api from "../../api/api";

import CustomerLayout from "../../layouts/CustomerLayout";

import ProductCard from "../../components/Productcard";


function Products() {

    // ============================
    // PRODUCT DATA
    // ============================

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ============================
    // SEARCH
    // ============================

    const [search, setSearch] =
        useState("");

    const [
        debouncedSearch,
        setDebouncedSearch
    ] = useState("");


    // ============================
    // FILTERS
    // ============================

    const [sort, setSort] =
        useState("newest");

    const [
        stockStatus,
        setStockStatus
    ] = useState("");

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");


    // ============================
    // PAGINATION
    // ============================

    const [page, setPage] =
        useState(1);

    const [
        pagination,
        setPagination
    ] = useState(null);



    // ============================
    // SEARCH DEBOUNCE
    // ============================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                setDebouncedSearch(
                    search.trim()
                );

                setPage(1);

            }, 500);


        return () => {
            clearTimeout(timer);
        };

    }, [search]);



    // ============================
    // FETCH PRODUCTS
    // ============================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/products",
                        {
                            params: {

                                search:
                                    debouncedSearch ||
                                    undefined,

                                page,

                                limit: 8,

                                sort,

                                stockStatus:
                                    stockStatus ||
                                    undefined,

                                minPrice:
                                    minPrice ||
                                    undefined,

                                maxPrice:
                                    maxPrice ||
                                    undefined
                            }
                        }
                    );


                setProducts(
                    response.data.products ||
                    []
                );


                setPagination(
                    response.data.pagination ||
                    null
                );


            } catch (error) {

                console.error(
                    "Product loading error:",
                    error
                );


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
        debouncedSearch,
        page,
        sort,
        stockStatus,
        minPrice,
        maxPrice
    ]);



    // ============================
    // CLEAR FILTERS
    // ============================

    const handleClearFilters = () => {

        setSearch("");

        setDebouncedSearch("");

        setSort("newest");

        setStockStatus("");

        setMinPrice("");

        setMaxPrice("");

        setPage(1);

    };



    // ============================
    // PAGE CHANGE
    // ============================

    const handlePageChange = (
        newPage
    ) => {

        setPage(newPage);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };



    return (

        <CustomerLayout>


            {/* =================================
                    PAGE HERO
            ================================= */}

            <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50">

                <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">


                    <p className="font-semibold text-pink-600">
                        Our Collection
                    </p>


                    <h1 className="mt-2 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">

                        Find products for your
                        everyday needs.

                    </h1>


                    <p className="mt-4 max-w-2xl text-gray-600">

                        Explore cosmetics,
                        personal care, household
                        products and everyday
                        essentials available from
                        our shop.

                    </p>


                </div>

            </section>



            {/* =================================
                    PRODUCTS
            ================================= */}

            <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">


                {/* Search */}

                <div className="mb-6">

                    <div className="relative">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search products, brands, categories..."
                            className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-5 pr-12 outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setPage(1);
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                            >
                                ✕
                            </button>

                        )}

                    </div>

                </div>



                {/* Filters */}

                <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">


                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


                        {/* SORT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Sort By
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(
                                        e.target.value
                                    );

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



                        {/* STOCK */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Availability
                            </label>

                            <select
                                value={
                                    stockStatus
                                }
                                onChange={(e) => {

                                    setStockStatus(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
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



                        {/* MIN PRICE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Minimum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => {

                                    setMinPrice(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}
                                placeholder="₹0"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            />

                        </div>



                        {/* MAX PRICE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Maximum Price
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => {

                                    setMaxPrice(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}
                                placeholder="₹1000"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-pink-500"
                            />

                        </div>


                    </div>



                    {/* FILTER FOOTER */}

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">


                        <p className="text-sm text-gray-500">

                            Search and filter products
                            based on your needs.

                        </p>


                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >

                            Clear Filters

                        </button>


                    </div>


                </div>



                {/* HEADING */}

                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">


                    <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Products
                        </h2>


                        {!loading &&
                            pagination && (

                            <p className="mt-1 text-sm text-gray-500">

                                {
                                    pagination.totalProducts
                                }{" "}
                                products found

                            </p>

                        )}

                    </div>


                    {!loading &&
                        pagination && (

                        <p className="text-sm font-medium text-gray-500">

                            Page{" "}
                            {
                                pagination.currentPage
                            }{" "}
                            of{" "}
                            {
                                pagination.totalPages
                            }

                        </p>

                    )}


                </div>



                {/* =================================
                        LOADING
                ================================= */}

                {loading && (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                        {[
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ].map((item) => (

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



                {/* =================================
                        ERROR
                ================================= */}

                {!loading &&
                    error && (

                    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">


                        <div className="text-4xl">
                            ⚠️
                        </div>


                        <h3 className="mt-4 text-xl font-bold text-red-700">

                            Unable to load products

                        </h3>


                        <p className="mt-2 text-red-600">

                            {error}

                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                window.location.reload()
                            }
                            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white"
                        >

                            Try Again

                        </button>


                    </div>

                )}



                {/* =================================
                      EMPTY STATE
                ================================= */}

                {!loading &&
                    !error &&
                    products.length === 0 && (

                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">


                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">

                            🔍

                        </div>


                        <h3 className="mt-5 text-xl font-bold text-gray-900">

                            No products found

                        </h3>


                        <p className="mx-auto mt-2 max-w-md text-gray-500">

                            Try changing your search,
                            availability or price
                            filters.

                        </p>


                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                        >

                            Clear Filters

                        </button>


                    </div>

                )}



                {/* =================================
                       PRODUCT GRID
                ================================= */}

                {!loading &&
                    !error &&
                    products.length > 0 && (

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                        {products.map(
                            (product) => (

                            <ProductCard
                                key={
                                    product._id
                                }
                                product={
                                    product
                                }
                            />

                            )
                        )}


                    </div>

                )}



                {/* =================================
                       PAGINATION
                ================================= */}

                {!loading &&
                    !error &&
                    pagination &&
                    pagination.totalPages >
                        1 && (

                    <div className="mt-14 flex flex-wrap items-center justify-center gap-3">


                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                handlePageChange(
                                    page - 1
                                )
                            }
                            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            ← Previous

                        </button>



                        <span className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700">

                            {
                                pagination.currentPage
                            }

                            {" / "}

                            {
                                pagination.totalPages
                            }

                        </span>



                        <button
                            type="button"
                            disabled={
                                page ===
                                pagination.totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    page + 1
                                )
                            }
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