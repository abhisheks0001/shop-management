import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/Productcard";

function ProductDetails() {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    const [selectedImage, setSelectedImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);

                setProduct(response.data.product);
                setRelatedProducts(
                    response.data.relatedProducts || []
                );

                if (
                    response.data.product?.images?.length > 0
                ) {
                    setSelectedImage(
                        response.data.product.images[0]
                    );
                }

            } catch (error) {
                console.error(
                    "Failed to fetch product:",
                    error
                );

                // Customer is not logged in
                if (error.response?.status === 401) {
                    navigate("/login", {
                        state: {
                            from: location.pathname
                        }
                    });

                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load product."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [
        id,
        navigate,
        location.pathname
    ]);

    if (loading) {
        return (
            <CustomerLayout>
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">

                    <div className="grid gap-10 lg:grid-cols-2">

                        <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />

                        <div className="space-y-5">
                            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
                            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
                            <div className="h-24 animate-pulse rounded bg-gray-200" />
                        </div>

                    </div>

                </div>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>

                <div className="mx-auto max-w-4xl px-4 py-20 text-center">

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-10">

                        <h1 className="text-2xl font-bold text-red-700">
                            Unable to load product
                        </h1>

                        <p className="mt-3 text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/products")
                            }
                            className="mt-6 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white"
                        >
                            Back to Products
                        </button>

                    </div>

                </div>

            </CustomerLayout>
        );
    }

    if (!product) {
        return null;
    }

    const fallbackImage =
        "https://placehold.co/800x800?text=No+Image";

    return (
        <CustomerLayout>

            {/* Product */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">

                <div className="grid gap-12 lg:grid-cols-2">

                    {/* Images */}
                    <div>

                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">

                            <img
                                src={
                                    selectedImage ||
                                    product.images?.[0] ||
                                    fallbackImage
                                }
                                alt={product.name}
                                className="aspect-square w-full object-cover"
                            />

                        </div>

                        {product.images?.length > 1 && (

                            <div className="mt-4 grid grid-cols-5 gap-3">

                                {product.images.map(
                                    (image, index) => (

                                        <button
                                            type="button"
                                            key={image}
                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }
                                            className={`overflow-hidden rounded-xl border-2 ${
                                                selectedImage ===
                                                image
                                                    ? "border-pink-500"
                                                    : "border-transparent"
                                            }`}
                                        >

                                            <img
                                                src={image}
                                                alt={`${product.name} ${
                                                    index + 1
                                                }`}
                                                className="aspect-square w-full object-cover"
                                            />

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* Product information */}
                    <div className="flex flex-col justify-center">

                        <div className="flex flex-wrap gap-2">

                            <span className="rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700">
                                {product.category}
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                                {product.subCategory}
                            </span>

                        </div>

                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                            {product.name}
                        </h1>

                        {product.brand && (
                            <p className="mt-3 text-lg text-gray-500">
                                By {product.brand}
                            </p>
                        )}

                        <p className="mt-6 text-3xl font-bold text-gray-900">
                            ₹{product.price}
                        </p>

                        <div className="mt-5">

                            {product.stockStatus ===
                            "in-stock" ? (

                                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                                    In Stock
                                </span>

                            ) : (

                                <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                                    Out of Stock
                                </span>

                            )}

                        </div>

                        <div className="my-7 border-t border-gray-200" />

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Description
                            </h2>

                            <p className="mt-3 leading-7 text-gray-600">
                                {product.description ||
                                    "Product description is currently unavailable."}
                            </p>

                        </div>

                        <button
                            type="button"
                            disabled={
                                product.stockStatus !==
                                "in-stock"
                            }
                            className="mt-8 w-full rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {product.stockStatus ===
                            "in-stock"
                                ? "Buy / Book on WhatsApp"
                                : "Currently Out of Stock"}
                        </button>

                        <p className="mt-3 text-center text-sm text-gray-500">
                            You will be redirected to WhatsApp
                            to contact the shop.
                        </p>

                    </div>

                </div>

            </section>


            {/* Related */}
            {relatedProducts.length > 0 && (

                <section className="border-t border-gray-200 bg-white">

                    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">

                        <div className="mb-8">

                            <p className="font-semibold text-pink-600">
                                You may also like
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                Related Products
                            </h2>

                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {relatedProducts.map(
                                (relatedProduct) => (

                                    <ProductCard
                                        key={
                                            relatedProduct._id
                                        }
                                        product={
                                            relatedProduct
                                        }
                                    />

                                )
                            )}

                        </div>

                    </div>

                </section>

            )}

        </CustomerLayout>
    );
}

export default ProductDetails;