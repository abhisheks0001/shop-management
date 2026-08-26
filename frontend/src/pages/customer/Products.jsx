import { useEffect, useState } from "react";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/ProductCard";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProducts = async () => {
            try {

                const response = await api.get("/products");

                setProducts(response.data.products || []);

            } catch (error) {

                console.error(error);

                setError("Unable to load products.");

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    return (
        <CustomerLayout>

            <section className="bg-gradient-to-br from-pink-50 via-white to-purple-50">
                <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">

                    <p className="mb-2 font-semibold text-pink-600">
                        Our Collection
                    </p>

                    <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                        Find products for your everyday needs.
                    </h1>

                    <p className="mt-4 max-w-2xl text-gray-600">
                        Explore cosmetics, personal care and general store
                        products available from our shop.
                    </p>

                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">

                <div className="mb-8 flex items-end justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            All Products
                        </h2>

                        {!loading && (
                            <p className="mt-1 text-sm text-gray-500">
                                {products.length} products available
                            </p>
                        )}
                    </div>

                </div>

                {loading && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

                        <h3 className="text-xl font-semibold text-gray-900">
                            No products available
                        </h3>

                        <p className="mt-2 text-gray-500">
                            Products added by the shop will appear here.
                        </p>

                    </div>
                )}

                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

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

export default Products;