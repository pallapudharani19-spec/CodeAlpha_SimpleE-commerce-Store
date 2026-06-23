const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Neon DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Test
app.get("/", (req, res) => {
  res.send("Server Running");
});

// ================= PRODUCTS =================
app.get("/api/products", async (req, res) => {
  const result = await pool.query("SELECT id, name ,price, image, description FROM products");
  res.json(result.rows);
});

app.get("/api/products/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT id,name,price,image,description FROM products WHERE id=$1",
    [req.params.id]
  );
  res.json(result.rows[0]);
});

// ================= USERS =================
app.post("/api/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3)",
    [name, email, password]
  );

  res.json({ message: "Registered Successfully!" });
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "User not found" });
  }

  if (result.rows[0].password !== password) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.json({ message: "Login success" });
});

// ================= ORDERS =================
app.post("/api/orders", async (req, res) => {
  try {
    const { user_id, products, total } = req.body;

    await pool.query(
      "INSERT INTO orders (user_id, products, total) VALUES ($1,$2,$3)",
      [user_id, JSON.stringify(products), total]
    );

    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order failed" });
  }
});
// ================= START =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
}); 