import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./db.js";
import "./config/passport.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

console.log('🚀 Starting Webify server...');
console.log('📁 __dirname:', __dirname);
console.log('🔑 SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('🗄️ MONGODB_URI exists:', !!process.env.MONGODB_URI);

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

// Authentication middleware for profile routes
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "You must be logged in to perform this action" });
};

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
    // Only include defined fields to let defaults work properly
    const userData = {
      username,
      password,
    };
    
    // Only add email if it's provided
    if (email) {
      userData.email = email;
    }
    
    const newUser = new User(userData);

    await newUser.save();

    // Log the saved user to debug defaults
    console.log('User created with defaults:', {
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      bio: newUser.bio,
      phoneNumber: newUser.phoneNumber
    });

    // Return success without auto-login
    res.json({ 
      message: "Account created successfully! Please login.",
      user: {
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
        phoneNumber: newUser.phoneNumber
      }
    });
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

// Email transporter configuration
const createEmailTransporter = () => {
  if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Fallback to console logging if email not configured
  return {
    sendMail: (options) => {
      console.log("📧 Email would be sent with the following details:");
      console.log("To:", options.to);
      console.log("Subject:", options.subject);
      console.log("Text:", options.text);
      console.log("HTML:", options.html);
      return Promise.resolve({ messageId: 'console-log-id' });
    }
  };
};

// Password Reset Routes

// POST /api/forgot-password - Request password reset
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent."
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/auth/reset-password.html?token=${resetToken}`;

    const transporter = createEmailTransporter();
    
    // Email content
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER || 'noreply@webify.com',
      subject: 'Password Reset Request - Webify',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process within 10 minutes:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You are receiving this because you requested the reset of your Webify account password.</p>
          <p>Please click the following button to complete the process within 10 minutes:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #22d3ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetURL}</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">This is an automated message from Webify.</p>
        </div>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Password reset email sent successfully:", result.messageId);

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent."
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    
    // Provide more specific error messages for debugging
    if (error.code === 'EAUTH') {
      console.error("❌ Gmail authentication failed. Check EMAIL_USER and EMAIL_PASS in .env file");
    } else if (error.code === 'ESOCKET') {
      console.error("❌ Network error. Check internet connection");
    } else {
      console.error("❌ Unexpected error:", error.message);
    }
    
    res.status(500).json({ error: "Failed to send password reset email" });
  }
});

// POST /api/reset-password - Reset password with token
app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Find user by valid reset token
    const user = await User.findByPasswordResetToken(token);

    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired" });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    
    await user.save();

    res.json({
      success: true,
      message: "Your password has been reset successfully! You can now login with your new password."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Update user profile route
app.put("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const { fullName, email, bio, phone, profilePicture } = req.body;
    const userId = req.user._id;

    // Prepare update data
    const updateData = {};
    if (fullName !== undefined) updateData.username = fullName;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phoneNumber = phone;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server error during profile update" });
  }
});

// Get current user profile
app.get("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

// Test route to verify server is running updated code
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Server is running updated code!", 
    timestamp: new Date().toISOString(),
    version: "v2.0"
  });
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
app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log('🌐 Ready to accept connections!');
});
