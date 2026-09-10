import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import api from "../../api/api";

import CustomerLayout from "../../layouts/CustomerLayout";

import ProductCard from "../../components/Productcard";

import categories from "../../config/categories";

function CategoryProducts() {

    const {
        category,
        subCategory
    } = useParams();


    const readableCategory =
        decodeURIComponent(category);

    const readableSubCategory =
        subCategory
            ? decodeURIComponent(subCategory)
            : null;


    const [products, setProducts] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [pagination, setPagination] =
        useState(null);


    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");

                let endpoint =
                    `/products/category/${encodeURIComponent(
                        readableCategory
                    )}`;

                if (readableSubCategory) {

                    endpoint +=
                        `/${encodeURIComponent(
                            readableSubCategory
                        )}`;

                }


                const response =
                    await api.get(
                        endpoint,
                        {
                            params: {
                                page,
                                limit: 8
                            }
                        }
                    );


                setProducts(
                    response.data.products || []
                );


                setPagination(
                    response.data.pagination ||
                    null
                );


            } catch (error) {

                console.error(
                    "Category loading error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchProducts();


    }, [
        readableCategory,
        readableSubCategory,
        page
    ]);


    // Whenever category changes
    // return to first page
    useEffect(() => {

        setPage(1);

    }, [
        readableCategory,
        readableSubCategory
    ]);


    const availableSubCategories =
        categories[readableCategory] || [];


    return (

        <CustomerLayout>


            {/* Category Hero */}
            <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-pink-950 text-white">

                <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">


                    {/* Breadcrumb */}
                    <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-400">

                        <Link
                            to="/"
                            className="transition hover:text-white"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <Link
                            to="/products"
                            className="transition hover:text-white"
                        >
                            Products
                        </Link>

                        <span>/</span>

                        <span className="text-white">
                            {readableCategory}
                        </span>

                        {readableSubCategory && (
                            <>
                                <span>/</span>

                                <span className="text-pink-300">
                                    {
                                        readableSubCategory
                                    }
                                </span>
                            </>
                        )}

                    </div>


                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-300">
                        Shop by category
                    </p>


                    <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                        {readableCategory}
                    </h1>


                    {readableSubCategory ? (

                        <p className="mt-3 max-w-2xl text-lg text-gray-300">
                            Browse our{" "}
                            <span className="font-semibold text-white">
                                {
                                    readableSubCategory
                                }
                            </span>{" "}
                            collection.
                        </p>

                    ) : (

                        <p className="mt-3 max-w-2xl text-lg text-gray-300">
                            Explore products available
                            under {readableCategory}.
                        </p>

                    )}


                    {/* Subcategory Navigation */}
                    {availableSubCategories.length >
                        0 && (

                        <div className="mt-8 flex flex-wrap gap-3">


                            <Link
                                to={`/category/${encodeURIComponent(
                                    readableCategory
                                )}`}
                                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                    !readableSubCategory
                                        ? "bg-white text-gray-900"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                All
                            </Link>


                            {availableSubCategories.map(
                                (item) => (

                                    <Link
                                        key={item}
                                        to={`/category/${encodeURIComponent(
                                            readableCategory
                                        )}/${encodeURIComponent(
                                            item
                                        )}`}
                                        className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                                            readableSubCategory ===
                                            item
                                                ? "bg-pink-500 text-white"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                    >
                                        {item}
                                    </Link>

                                )
                            )}


                        </div>

                    )}


                </div>

            </section>



            {/* Product Area */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">


                {/* Heading */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">


                    <div>

                        <p className="font-semibold text-pink-600">

                            {readableSubCategory
                                ? readableSubCategory
                                : "All products"}

                        </p>


                        <h2 className="mt-1 text-3xl font-bold text-gray-900">

                            {readableSubCategory
                                ? `${readableSubCategory} Products`
                                : `${readableCategory} Products`}

                        </h2>


                        {!loading &&
                            pagination && (

                            <p className="mt-2 text-sm text-gray-500">

                                {
                                    pagination.totalProducts
                                }{" "}
                                products found

                            </p>

                        )}

                    </div>


                    <Link
                        to="/products"
                        className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        View All Products
                    </Link>


                </div>



                {/* Loading */}
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
                        ].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                                >

                                    <div className="aspect-square animate-pulse bg-gray-200" />

                                    <div className="space-y-3 p-5">

                                        <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200" />

                                        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                                        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}



                {/* Error */}
                {!loading &&
                    error && (

                    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-14 text-center">

                        <div className="text-4xl">
                            ⚠️
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-red-700">
                            Unable to load products
                        </h3>

                        <p className="mt-2 text-red-600">
                            {error}
                        </p>

                        <Link
                            to="/products"
                            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 font-semibold text-white"
                        >
                            Browse all products
                        </Link>

                    </div>

                )}



                {/* No Products */}
                {!loading &&
                    !error &&
                    products.length === 0 && (

                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                            🛍️
                        </div>

                        <h3 className="mt-5 text-2xl font-bold text-gray-900">
                            No products available
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">

                            There are currently no
                            products available in{" "}

                            {readableSubCategory ||
                                readableCategory}.

                        </p>

                        <Link
                            to={`/category/${encodeURIComponent(
                                readableCategory
                            )}`}
                            className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                        >
                            View category
                        </Link>

                    </div>

                )}



                {/* Product Grid */}
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



                {/* Pagination */}
                {!loading &&
                    !error &&
                    pagination &&
                    pagination.totalPages >
                        1 && (

                    <div className="mt-14 flex flex-wrap items-center justify-center gap-4">


                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={() => {

                                setPage(
                                    (prev) =>
                                        prev - 1
                                );

                                window.scrollTo({
                                    top: 0,
                                    behavior:
                                        "smooth"
                                });

                            }}
                            className="rounded-full border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ← Previous
                        </button>


                        <span className="rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700">

                            Page{" "}
                            {
                                pagination.currentPage
                            }{" "}
                            of{" "}
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
                            onClick={() => {

                                setPage(
                                    (prev) =>
                                        prev + 1
                                );

                                window.scrollTo({
                                    top: 0,
                                    behavior:
                                        "smooth"
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

export default CategoryProducts;