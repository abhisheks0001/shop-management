import { useEffect, useState } from "react";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/Productcard";

function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const response = await api.get("/products");

                setProducts(response.data.products);

            } catch (error) {

                console.error(error);

                setError("Failed to load products");

            } finally {

                setLoading(false);
            }
        };

        fetchProducts();

    }, []);

    if (loading) {
        return (
            <CustomerLayout>
                <p>Loading products...</p>
            </CustomerLayout>
        );
    }

    if (error) {
        return (
            <CustomerLayout>
                <p>{error}</p>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>

            <h1>Products</h1>

            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap"
                    }}
                >
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            )}

        </CustomerLayout>
    );
}

export default Products;