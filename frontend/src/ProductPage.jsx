import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function ProductPage({ cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      <button onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1>{product.name}</h1>

      <img
  src={imageMap[product.name]}
  alt={product.name}
  style={{
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
  }}
/>
      <h2>₹{product.price}</h2>

      <p>
        Premium quality {product.name}. Comfortable,
        durable and suitable for everyday use.
      </p>

      <button
        onClick={() => setCart([...cart, product])}
        style={{
          background: "green",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductPage;