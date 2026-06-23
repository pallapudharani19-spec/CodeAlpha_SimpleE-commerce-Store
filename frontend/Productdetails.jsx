import { useParams } from "react-router-dom";

function ProductDetails({ products }) {
  const { id } = useParams();

  const product = products.find(
    (p) => p.id.toString() === id
  );

  if (!product) return <h2>Product not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width="250"
      />

      <h2>₹{product.price}</h2>

      <p>
        High quality {product.name} for daily use.
      </p>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;