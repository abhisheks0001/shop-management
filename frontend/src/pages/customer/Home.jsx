import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/Productcard";

function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await api.get(
                    "/products?featured=true&limit=4"
                );

                setFeaturedProducts(response.data.products || []);
            } catch (error) {
                console.error("Failed to load featured products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const categories = [
        {
            name: "Cosmetics",
            description: "Skin, hair, makeup and personal care products.",
            path: "/category/Cosmetics"
        },
        {
            name: "General Store",
            description: "Everyday household and general-use essentials.",
            path: "/category/General%20Store"
        }
    ];

    return (
        <CustomerLayout>

            {/* Hero */}
            <section className="bg-gradient-to-br from-pink-50 via-white to-purple-100">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-8">

                    <div>
                        <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
                            Cosmetics & General Store
                        </span>

                        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
                            Everyday products,
                            <span className="text-pink-600">
                                {" "}all in one place.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
                            Explore cosmetics, personal care and everyday
                            essentials from our shop.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">

                            <Link
                                to="/products"
                                className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-pink-600"
                            >
                                Browse Products
                            </Link>

                            <a
                                href="#categories"
                                className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-900"
                            >
                                Explore Categories
                            </a>

                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-3xl bg-white p-8 shadow-xl">

                            <div className="grid grid-cols-2 gap-4">

                                <div className="rounded-2xl bg-pink-100 p-8">
                                    <p className="text-sm font-medium text-pink-700">
                                        Cosmetics
                                    </p>

                                    <p className="mt-12 text-2xl font-bold text-gray-900">
                                        Beauty & Care
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-purple-100 p-8">
                                    <p className="text-sm font-medium text-purple-700">
                                        Essentials
                                    </p>

                                    <p className="mt-12 text-2xl font-bold text-gray-900">
                                        Daily Needs
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Categories */}
            <section
                id="categories"
                className="mx-auto max-w-7xl px-4 py-16 md:px-8"
            >

                <div className="mb-8">
                    <p className="font-semibold text-pink-600">
                        Shop by category
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                        Find what you need
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={category.path}
                            className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {category.name}
                                    </h3>

                                    <p className="mt-2 max-w-md text-gray-500">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl transition group-hover:bg-gray-900 group-hover:text-white">
                                    →
                                </div>

                            </div>

                        </Link>
                    ))}

                </div>

            </section>

            {/* Featured */}
            <section className="bg-white">
                <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">

                    <div className="mb-8 flex items-end justify-between">

                        <div>
                            <p className="font-semibold text-pink-600">
                                Featured
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                Popular products
                            </h2>
                        </div>

                        <Link
                            to="/products"
                            className="font-semibold text-gray-700 hover:text-pink-600"
                        >
                            View all →
                        </Link>

                    </div>

                    {loading ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-96 animate-pulse rounded-2xl bg-gray-200"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}

                        </div>
                    )}

                </div>
            </section>

        </CustomerLayout>
    );
}

export default Home;