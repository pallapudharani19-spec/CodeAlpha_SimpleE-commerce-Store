import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://codealpha-simplee-commerce-store-jesr.onrender.com";

// HOME
function Home({ cart, setCart, loggedIn, setLoggedIn }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const[search, setSearch] = useState("");
  useEffect(() => {
    if (loggedIn) {
      fetch(`${API}/api/products`)
        .then((res) => res.json())
        .then((data) => {
  console.log(data);
  setProducts(data);   // 🔥 THIS LINE WAS MISSING
});
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>🛒 E-commerce Store </h1>
        

        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    );
  }

  return (
    <div>

  {/* NAVBAR */}
  <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#111827",
  color: "white"
}}>
  <h2 style={{ margin: 0 }}>🛒 Store</h2>

  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    <span>Cart: {cart.length}</span>

    <button
      style={{
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer"
      }}
      onClick={() => {
        localStorage.removeItem("user");
        setLoggedIn(false);
      }}
    >
      Logout
    </button>
  </div>
</div>
  {/* ORIGINAL CONTENT */}
  <div style={{ padding: "20px" }}>
  </div>
      <h1 style={{ textAlign: "center" }}>
        🛒 E-commerce Store
      </h1>
      <h2>Products</h2>
      <input
  type="text"
  placeholder="🔍 Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "12px",
    width: "100%",
    margin: "20px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
  }}
/>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  }}
>
  {products
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .map((p) => (
      <div
  key={p.id}
  style={{
    background: "white",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
        <img
          src={p.image}
          alt={p.name}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />

        <h3>{p.name}</h3>
        <p>₹{p.price}</p>

       <button
  style={{
    width: "100%",
    marginTop: "10px",
    background: "#2563eb",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold"
  }}
  onClick={() => {
    const existing = cart.find(
      (item) => item.id === p.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === p.id
            ? {
                ...item,
                quantity: (item.quantity || 1) + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...p, quantity: 1 },
      ]);
    }
  }}
>
  Add to Cart
</button>
      </div>
    ))}
</div>


      <h1
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontSize: "40px",
        }}
      >
        🛒 CART
      </h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No items in cart
        </p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i}>
              <p>
  {item.name} x {item.quantity || 1} - ₹
  {Number(item.price) * (item.quantity || 1)}
</p>

              <button
                onClick={() =>
                  setCart(
                    cart.filter(
                      (_, index) => index !== i
                    )
                  )
                }
              >
                Remove
              </button>
            </div>
          ))}

          <h2>
            Total: ₹
            {cart.reduce(
  (total, item) =>
    total +
    Number(item.price) *
      (item.quantity || 1),
  0
)}
          </h2>
        </>
      )}
    </div>
  );
}

// PRODUCT DETAILS
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
        padding: "20px",
        textAlign: "center",
      }}
    >
      <button onClick={() => navigate("/")}>
        ← Back
      </button>

      <h1>{product.name}</h1>

     <img
  src={product.image}
  alt={product.name}
  onError={(e) => {
    e.target.src = "https://picsum.photos/300";
  }}
  style={{
    width: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
  }}
/>

      <h2>₹{product.price}</h2>

      <p>
        Premium quality {product.name}.
      </p>

     <button
  onClick={() => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  (item.quantity || 1) + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }}
>
  Add to Cart
</button>
    </div>
  );
}

// REGISTER
function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch(
      `${API}/api/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);

    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)
        }
      />
      <br />
      <br />

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />
      <br />
      <br />

      <button onClick={register}>
        Register
      </button>
    </div>
  );
}

// LOGIN
function Login({ setLoggedIn }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const login = async () => {
    const res = await fetch(
      `${API}/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await res.json();

    alert(data.message);
    if (data.message === "Login success") {
      setLoggedIn(true);
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />
      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />
      <br />
      <br />

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}
// MAIN APP
function App() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}, []);
  const [loggedIn, setLoggedIn] =
    useState(false);

  const placeOrder = async () => {
    const total = cart.reduce(
  (total, item) =>
    total +
    Number(item.price) *
      (item.quantity || 1),
  0
);
    const res = await fetch(
      `${API}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          products: cart,
          total,
        }),
      }
    );

    const data = await res.json();

    alert("Order placed successfully!");
setCart([]);

const logout = window.confirm(
  "Do you want to logout?"
);

if (logout) {
  setLoggedIn(false);
}
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cart={cart}
              setCart={setCart}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductPage
              cart={cart}
              setCart={setCart}
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={
            <Login
              setLoggedIn={
                setLoggedIn
              }
            />
          }
        />
      </Routes>

      {loggedIn && cart.length > 0 && (
        <button
          onClick={placeOrder}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "green",
            color: "white",
            padding: "15px 25px",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
          }}
        >
          Place Order
        </button>
      )}
    </BrowserRouter>
  );
}

export default App;