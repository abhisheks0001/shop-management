import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();

    const handleProductClick = () => {
        navigate(`/product/${product._id}`);
    };

    return (
        <div
            onClick={handleProductClick}
            style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px",
                width: "220px",
                cursor: "pointer"
            }}
        >

            {product.images?.length > 0 && (
                <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover"
                    }}
                />
            )}

            <h3>{product.name}</h3>

            <p>₹{product.price}</p>

            <p>{product.brand}</p>

            <p>
                {product.category} - {product.subCategory}
            </p>

            <p>
                {product.stockStatus === "in-stock"
                    ? "In Stock"
                    : "Out of Stock"}
            </p>

        </div>
    );
}

export default ProductCard;