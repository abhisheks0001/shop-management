import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/Productcard";

function CategoryProducts() {
    const { category, subCategory } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                let endpoint = `/products/category/${category}`;

                if (subCategory) {
                    endpoint += `/${subCategory}`;
                }

                const response = await api.get(endpoint);

                setProducts(response.data.products || []);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load category products"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [category, subCategory]);

    const readableCategory = decodeURIComponent(category);

    const readableSubCategory = subCategory
        ? decodeURIComponent(subCategory)
        : null;

    return (
        <CustomerLayout>

            <section className="bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-14 text-white md:px-8">

                    <p className="text-sm font-semibold uppercase tracking-wider text-pink-300">
                        Category
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        {readableCategory}
                    </h1>

                    {readableSubCategory && (
                        <p className="mt-2 text-gray-300">
                            {readableSubCategory}
                        </p>
                    )}

                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">

                {loading && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-96 animate-pulse rounded-2xl bg-gray-200"
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
                        <h3 className="text-xl font-semibold">
                            No products found
                        </h3>
                    </div>
                )}

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

            </section>

        </CustomerLayout>
    );
}

export default CategoryProducts;