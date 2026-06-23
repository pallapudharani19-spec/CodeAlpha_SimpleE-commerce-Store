import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import shoes from "./assets/shoes.jpg";
import tshirt from "./assets/tshirt.jpg";
import watch from "./assets/watch.jpg";

// IMAGE MAPPING (IMPORTANT FIX)
const imageMap = {
  Shoes: shoes,
  TShirt: tshirt,
  Watch: watch,
};

function Home({ cart, setCart, loggedIn }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const API = "http://localhost:5000"; // change if needed

  useEffect(() => {
    if (loggedIn) {
      fetch(`${API}/api/products`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setProducts(data);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🛒 NeonCart</h1>

        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{ marginLeft: "10px" }}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#f7f7f7", minHeight: "100vh" }}>
      
      <h1 style={{ textAlign: "center" }}>🛒 NeonCart</h1>

      <h2 style={{ textAlign: "center" }}>Products</h2>

      {/* PRODUCTS GRID */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              background: "#fff",
              width: "250px",
            }}
          >
            {/* PRODUCT IMAGE */}
            <img
              src={imageMap[p.name]}
              alt={p.name}
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            />

            {/* PRODUCT NAME */}
            <h3
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              {p.name}
            </h3>

            {/* PRICE */}
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>

            {/* ADD BUTTON */}
            <button
              onClick={() => setCart([...cart, p])}
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                background: "#28a745",
                color: "white",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART SECTION */}
      <h1
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "40px",
        }}
      >
        🛒 CART
      </h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#fff",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        {cart.length === 0 ? (
          <p style={{ textAlign: "center" }}>No items in cart</p>
        ) : (
          <>
            {cart.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <p style={{ margin: 0 }}>
                  {item.name} - ₹{item.price}
                </p>

                <button
                  onClick={() =>
                    setCart(cart.filter((_, index) => index !== i))
                  }
                  style={{
                    padding: "6px 10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <h2 style={{ textAlign: "center", marginTop: "10px" }}>
              Total: ₹
              {cart.reduce((a, b) => a + Number(b.price), 0)}
            </h2>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;