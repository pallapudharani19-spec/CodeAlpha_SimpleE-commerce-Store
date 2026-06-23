import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";

const API = "http://localhost:5000";

// HOME
function Home({ cart, setCart, loggedIn, setLoggedIn }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const[search, setSearch] = useState("");
  useEffect(() => {
    if (loggedIn) {
      fetch(`${API}/api/products`)
        .then((res) => res.json())
        .then((data) => setProducts(data));
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>
        🛒 E-commerce Store
      </h1>
      <h2>Products</h2>
      <input
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    padding: "10px",
    width: "100%",
    marginBottom: "20px",
  }}
/>

      {products
  .filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((p) => (
        <div
          key={p.id}
          style={{
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  textAlign: "center",
  maxWidth: "350px",
  margin: "15px auto",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
}}
        >
          <img
  src={p.image}
  alt={p.name}
  onError={(e) => {
    e.target.src = "https://picsum.photos/200";
  }}
  style={{
    width: "100%",
maxWidth: "220px",
height: "220px",
    objectFit: "cover",
    borderRadius: "10px",
  }}
/>

          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            {p.name}
          </h3>

          <p>₹{p.price}</p>

          <button
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