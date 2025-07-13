const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/user");
const Product = require("../models/product");
const Payment = require("../models/payment");
const Order = require("../models/order");

// --- Test Data ---
const TEST_CUSTOMER_DATA = {
  fullName: "Order Customer",
  email: "order.customer@example.com",
  phone_number: "9855555555",
  password: "password123",
  role: "Customer",
};

const TEST_ADMIN_DATA = {
  fullName: "Order Admin",
  email: "order.admin@example.com",
  phone_number: "9866666666",
  password: "adminpassword",
  role: "Admin",
};

const TEST_PRODUCT_DATA = {
  title: "Test Product for Order",
  desc: "A product to be ordered",
  image: "order_image.jpg",
  categoryId: new mongoose.Types.ObjectId(),
  size: "L",
  color: "Red",
  price: 250,
  quantity: 50,
};

// --- Global Variables ---
let customerToken;
let adminToken;
let testCustomerId;
let testProductId;
let testPaymentId;
let testOrderId;

// --- Test Hooks ---
afterAll(async () => {
  // Clean up all test data from the database
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Product.deleteMany({ title: { $regex: /Test Product/ } });
  await Order.deleteMany({});
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Order API", () => {
  // This runs once before all tests, setting up all necessary data.
  beforeAll(async () => {
    // 1. Clean up previous test runs
    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 2. Create users and product
    const customer = await new User(TEST_CUSTOMER_DATA).save();
    testCustomerId = customer._id;
    await new User(TEST_ADMIN_DATA).save();
    const product = await new Product(TEST_PRODUCT_DATA).save();
    testProductId = product._id;
    
    // Generate a placeholder ObjectId for the payment to avoid validation errors
    testPaymentId = new mongoose.Types.ObjectId();

    // 3. Log in both users to get their tokens
    const customerLoginRes = await request(app).post("/api/auth/login").send({
      email: TEST_CUSTOMER_DATA.email,
      password: TEST_CUSTOMER_DATA.password,
    });
    customerToken = customerLoginRes.body.token;

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: TEST_ADMIN_DATA.email,
      password: TEST_ADMIN_DATA.password,
    });
    adminToken = adminLoginRes.body.token;
  });

 




  
  test("1. Should return 404 when an admin tries to get a non-existent order", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/order/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });

  
});