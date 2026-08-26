import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {

    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${product._id}`);
    };

    const image =
        product.images?.length > 0
            ? product.images[0]
            : "https://placehold.co/500x500?text=No+Image";

    return (
        <article
            onClick={handleProductClick}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

            <div className="relative aspect-square overflow-hidden bg-gray-100">

                <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                {product.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-pink-600 px-3 py-1 text-xs font-semibold text-white">
                        Featured
                    </span>
                )}

                <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
                        product.stockStatus === "in-stock"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {product.stockStatus === "in-stock"
                        ? "In Stock"
                        : "Out of Stock"}
                </span>

            </div>

            <div className="p-5">

                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-pink-600">
                    {product.category}
                </p>

                <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                    {product.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    {product.brand || product.subCategory}
                </p>

                <div className="mt-4 flex items-center justify-between">

                    <span className="text-xl font-bold text-gray-900">
                        ₹{product.price}
                    </span>

                    <button
                        type="button"
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white"
                    >
                        View
                    </button>

                </div>

            </div>

        </article>
    );
}

export default ProductCard;