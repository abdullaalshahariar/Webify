// Login button functionality
document.querySelector(".login-btn").addEventListener("click", function () {
  console.log("Login button clicked");
  // Redirect to auth page with login tab active
  window.location.href = "../auth/login.html";
});

// Join Now button functionality
document.querySelector(".join-btn").addEventListener("click", function () {
  console.log("Join Now button clicked");
  // Redirect to auth page with signup tab active
  window.location.href = "../auth/login.html?tab=signup";
});

// Optional: Add smooth scroll or other interactive features
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded successfully");

  // You can add more interactive features here
  // For example: form validation, API calls, etc.
});
