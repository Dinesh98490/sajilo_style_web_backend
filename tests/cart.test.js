const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product"); // You must have a Product model
const Cart = require("../models/cart");

// --- Test Data ---
const TEST_USER_DATA = {
  fullName: "Cart Test User",
  email: "cart.user@example.com",
  phone_number: "9876543210",
  password: "password123",
  role: "Customer",
};

// --- FIX IS HERE ---
// Updated TEST_PRODUCT_DATA to include all required fields from your Product model.
const TEST_PRODUCT_DATA = {
  title: "Test Product for Cart",
  desc: "A product to be added to the cart", // Assuming 'desc' is the key from your model
  image: "test_image.jpg",
  categoryId: new mongoose.Types.ObjectId(), // Generates a valid placeholder ID
  size: "M",
  color: "Blue",
  price: 100,
  quantity: 10, // Assuming this is the field instead of 'stock' based on the error
};

// --- Global Variables ---
let authToken;
let testUserId;
let testProductId;
let testCartId;

// --- Test Hooks ---
afterAll(async () => {
  // Clean up all test data from the database
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Product.deleteMany({ title: { $regex: /Test Product/ } });
  await Cart.deleteMany({}); // Delete all cart items
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Cart API", () => {
  // This runs once before all tests in this suite.
  // It sets up a user, a product, and logs the user in.
  beforeAll(async () => {
    // 1. Clean up previous test runs
    await User.deleteOne({ email: TEST_USER_DATA.email });
    await Product.deleteOne({ title: TEST_PRODUCT_DATA.title });
    await Cart.deleteMany({});

    
    const user = await new User(TEST_USER_DATA).save();
    testUserId = user._id;

    
    const product = await new Product(TEST_PRODUCT_DATA).save();
    testProductId = product._id;

    
    const loginRes = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email,
      password: TEST_USER_DATA.password,
    });
    authToken = loginRes.body.token;
  });

 


  // 
  test("1. Should return 404 when trying to get a non-existent cart item", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/cart/${nonExistentId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
  


  // 8. Security Test: User B cannot see/access User A's cart
  test("2. Should NOT allow a user to access another user's cart items", async () => {
    const secondUserData = { ...TEST_USER_DATA, email: "second.user@example.com", phone_number: "9811223344" };
    await new User(secondUserData).save();
    const secondLoginRes = await request(app).post("/api/auth/login").send({ email: secondUserData.email, password: secondUserData.password });
    const secondAuthToken = secondLoginRes.body.token;

    const res = await request(app)
      .get(`/api/cart/${testCartId}`)
      .set("Authorization", `Bearer ${secondAuthToken}`);

    expect(res.statusCode).toBe(404);
  });



});