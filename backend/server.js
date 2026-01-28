import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./db.js";
import "./config/passport.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

// 1. Connect to MongoDB Atlas
connectDB();

// 2. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session Configuration (The "Database for Cookies")
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 Day
    },
  }),
);

// 4. Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --- STATIC FILES & ROUTING ---

// Serve Builder App
const builderDist = path.join(
  __dirname,
  "../frontend/builder2/SaaticBuilder2/dist",
);
app.use("/builder", express.static(builderDist));

// API Routes (Login/Logout/Signup)

// Import User model for signup
import User from "./models/User.js";

// Import Community Routes
import communityRoutes from "./routes/community.js";

// Use Community Routes
app.use("/api", communityRoutes);

// Signup Route
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create new user (password will be hashed by the pre-save hook)
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Return success without auto-login
    res.json({ message: "Account created successfully! Please login." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Login Route
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Server error during login" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentials" });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error creating session" });
      }
      return res.json({ message: "Logged in!", user: req.user });
    });
  })(req, res, next);
});

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Protected Route Example
app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Builder SPA Routing
app.get(/^\/builder(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(builderDist, "index.html"));
});

// Main Landing Page
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`),
);
