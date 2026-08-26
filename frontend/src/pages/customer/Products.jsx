import { useEffect, useState } from "react";

import api from "../../api/api";
import CustomerLayout from "../../layouts/CustomerLayout";

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
                products.map((product) => (

                    <div key={product._id}>

                        <h3>{product.name}</h3>

                        <p>
                            ₹{product.price}
                        </p>

                        <p>
                            {product.category}
                            {" - "}
                            {product.subCategory}
                        </p>

                    </div>

                ))
            )}

        </CustomerLayout>
    );
}

export default Products;