const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Product = require("./models/product");
const User = require("./models/user.model");
const Order = require("./models/order"); 
const app = express();
const port = 1337;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/MariaCoffeeSia", {});

mongoose.connection.on("connected", () => {
  console.log(" Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// --- Validation Helpers ---
function validateProductInput(data) {
  const errors = [];
  if (!data.id || typeof data.id !== "string") errors.push("Product ID is required and must be a string.");
  if (!data.name || typeof data.name !== "string") errors.push("Product name is required and must be a string.");
  if (data.price === undefined || isNaN(Number(data.price))) errors.push("Product price is required and must be a number.");
  if (!data.description || typeof data.description !== "string") errors.push("Product description is required and must be a string.");
  if (!data.type || typeof data.type !== "string") errors.push("Product type is required and must be a string.");
  if (
    data.available === undefined ||
    (typeof data.available !== "boolean" &&
      data.available !== "true" &&
      data.available !== "false")
  )
    errors.push("Product availability is required and must be true or false.");
  return errors;
}

function validateUserInput(data) {
  const errors = [];
  if (!data.id || typeof data.id !== "string") errors.push("User ID is required and must be a string.");
  if (!data.username || typeof data.username !== "string") errors.push("Username is required and must be a string.");
  if (!data.password || typeof data.password !== "string" || data.password.length < 6) errors.push("Password is required and must be at least 6 characters.");
  return errors;
}
function validateOrderInput(data) {
  const errors = [];
  if (!data.name || typeof data.name !== "string") errors.push("Customer name is required.");
  if (!data.address || typeof data.address !== "string") errors.push("Address is required.");
  if (!Array.isArray(data.items) || data.items.length === 0) errors.push("Order items are required.");
  if (data.total === undefined || isNaN(Number(data.total))) errors.push("Total is required and must be a number.");
  if (!data.date || typeof data.date !== "string") errors.push("Date is required."); // <-- Add this line
  if (!data.username || typeof data.username !== "string") errors.push("Username is required."); // <-- Add this line
  return errors;
}

// --- Product Routes ---

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product with image upload
app.post("/api/products", upload.single("image"), async (req, res) => {
  const { id, name, price, description, type, available } = req.body;
  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const product = new Product({
      id,
      name,
      price,
      description,
      imageUrl,
      type,
      available,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product (optionally with image)
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  const errors = validateProductInput({ ...req.body, id: req.params.id });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Product ID is required." });
  }
  try {
    await Product.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- User Routes ---

app.post("/api/users", async (req, res) => {
  const errors = validateUserInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user (admin check)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  try {
    // Hardcoded admin check
    if (username === "admin" && password === "admin123") {
      return res.json({ success: true, isAdmin: true });
    }
    // Regular user check
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid username or password" });
    }
    res.json({ success: true, isAdmin: false });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error during login" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const errors = validateUserInput({ ...req.body, id: req.params.id });
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    const updated = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user by id
app.delete("/api/users/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "User ID is required." });
  }
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Order Routes ---
app.post("/api/orders", async (req, res) => {
  const errors = validateOrderInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  try {
    console.log("Order payload:", req.body); // Add this line
    const order = new Order({
      ...req.body,
      username: req.body.username
    });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (for admin)
app.get("/api/orders/user/:username", async (req, res) => {
  try {
    const orders = await Order.find({
      username: { $regex: `^${req.params.username}$`, $options: "i" }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders/all", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get orders by customer name (for customer) - CASE INSENSITIVE
app.get("/api/orders/customer/:name", async (req, res) => {
  try {
    console.log("Fetching orders for:", req.params.name);
    const orders = await Order.find({
      name: { $regex: `^${req.params.name}$`, $options: "i" }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
app.put("/api/orders/:id", async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});