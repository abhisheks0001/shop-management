import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

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

                const response = await api.get(
                    `/products/${id}`
                );

                const fetchedProduct =
                    response.data.product;

                setProduct(fetchedProduct);

                setRelatedProducts(
                    response.data.relatedProducts || []
                );

                if (
                    fetchedProduct?.images?.length > 0
                ) {
                    setSelectedImage(
                        fetchedProduct.images[0]
                    );
                }

            } catch (error) {
                console.error(
                    "Failed to fetch product:",
                    error
                );

                if (error.response?.status === 401) {
                    navigate("/login", {
                        state: {
                            from: location.pathname
                        },
                        replace: true
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


    const handleWhatsApp = () => {
        if (!product) {
            return;
        }

        const phoneNumber =
            "919084915638";

        const message = `
Hello, I am interested in this product.

Product: ${product.name}
Brand: ${product.brand || "N/A"}
Price: ₹${product.price}

Product Link:
${window.location.href}
        `.trim();

        const whatsappUrl =
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
            )}`;

        window.open(
            whatsappUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    if (loading) {
        return (
            <CustomerLayout>

                <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">

                    <div className="grid gap-12 lg:grid-cols-2">

                        <div>

                            <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />

                            <div className="mt-4 grid grid-cols-4 gap-3">

                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="aspect-square animate-pulse rounded-xl bg-gray-200"
                                        />
                                    )
                                )}

                            </div>

                        </div>


                        <div className="flex flex-col justify-center">

                            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

                            <div className="mt-5 h-12 w-3/4 animate-pulse rounded bg-gray-200" />

                            <div className="mt-4 h-6 w-40 animate-pulse rounded bg-gray-200" />

                            <div className="mt-7 h-10 w-32 animate-pulse rounded bg-gray-200" />

                            <div className="mt-7 h-28 animate-pulse rounded bg-gray-200" />

                            <div className="mt-8 h-14 animate-pulse rounded-2xl bg-gray-200" />

                        </div>

                    </div>

                </section>

            </CustomerLayout>
        );
    }


    if (error) {
        return (
            <CustomerLayout>

                <section className="mx-auto max-w-3xl px-4 py-20 text-center">

                    <div className="rounded-3xl border border-red-200 bg-red-50 p-10">

                        <div className="text-4xl">
                            ⚠️
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-red-700">
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
                            className="mt-7 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                        >
                            Back to Products
                        </button>

                    </div>

                </section>

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

            {/* Breadcrumb */}
            <section className="border-b border-gray-200 bg-white">

                <div className="mx-auto max-w-7xl px-4 py-4 text-sm text-gray-500 md:px-8">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="hover:text-pink-600"
                    >
                        Home
                    </button>

                    <span className="mx-2">
                        /
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
                        className="hover:text-pink-600"
                    >
                        Products
                    </button>

                    <span className="mx-2">
                        /
                    </span>

                    <span className="text-gray-900">
                        {product.name}
                    </span>

                </div>

            </section>


            {/* Product */}
            <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">

                <div className="grid gap-12 lg:grid-cols-2">

                    {/* Image Gallery */}
                    <div>

                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

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

                            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">

                                {product.images.map(
                                    (
                                        image,
                                        index
                                    ) => (

                                        <button
                                            type="button"
                                            key={`${image}-${index}`}
                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }
                                            className={`overflow-hidden rounded-xl border-2 transition ${
                                                selectedImage ===
                                                image
                                                    ? "border-pink-500"
                                                    : "border-transparent hover:border-gray-300"
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


                    {/* Details */}
                    <div className="flex flex-col justify-center">

                        <div className="flex flex-wrap gap-2">

                            <span className="rounded-full bg-pink-100 px-4 py-1.5 text-sm font-semibold text-pink-700">
                                {product.category}
                            </span>

                            <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600">
                                {product.subCategory}
                            </span>

                            {product.featured && (
                                <span className="rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
                                    Featured
                                </span>
                            )}

                        </div>


                        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                            {product.name}
                        </h1>


                        {product.brand && (
                            <p className="mt-3 text-lg text-gray-500">
                                Brand:{" "}
                                <span className="font-semibold text-gray-700">
                                    {product.brand}
                                </span>
                            </p>
                        )}


                        <p className="mt-7 text-4xl font-bold text-gray-900">
                            ₹{product.price}
                        </p>


                        <div className="mt-5">

                            {product.stockStatus ===
                            "in-stock" ? (

                                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                                    <span className="h-2 w-2 rounded-full bg-green-500" />

                                    In Stock

                                </span>

                            ) : (

                                <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">

                                    <span className="h-2 w-2 rounded-full bg-red-500" />

                                    Out of Stock

                                </span>

                            )}

                        </div>


                        <div className="my-8 border-t border-gray-200" />


                        <div>

                            <h2 className="text-lg font-bold text-gray-900">
                                About this product
                            </h2>

                            <p className="mt-3 leading-7 text-gray-600">
                                {product.description ||
                                    "Product description is currently unavailable."}
                            </p>

                        </div>


                        <div className="mt-8 rounded-2xl bg-gray-50 p-5">

                            <p className="text-sm font-semibold text-gray-900">
                                Need this product?
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Contact the shop directly
                                through WhatsApp to confirm
                                availability and booking.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            disabled={
                                product.stockStatus !==
                                "in-stock"
                            }
                            className="mt-6 w-full rounded-2xl bg-green-600 px-6 py-4 text-lg font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:translate-y-0"
                        >
                            {product.stockStatus ===
                            "in-stock"
                                ? "Buy / Book on WhatsApp"
                                : "Currently Out of Stock"}
                        </button>


                        <p className="mt-3 text-center text-xs text-gray-400">
                            You will be redirected to
                            WhatsApp to contact the shop.
                        </p>

                    </div>

                </div>

            </section>


            {/* Related Products */}
            {relatedProducts.length > 0 && (

                <section className="border-t border-gray-200 bg-white">

                    <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">

                        <div className="mb-8 flex items-end justify-between gap-4">

                            <div>

                                <p className="font-semibold text-pink-600">
                                    You may also like
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                    Related Products
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/category/${encodeURIComponent(
                                            product.category
                                        )}/${encodeURIComponent(
                                            product.subCategory
                                        )}`
                                    )
                                }
                                className="hidden font-semibold text-gray-600 hover:text-pink-600 sm:block"
                            >
                                View more →
                            </button>

                        </div>


                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                            {relatedProducts.map(
                                (
                                    relatedProduct
                                ) => (

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