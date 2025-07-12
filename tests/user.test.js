const request = require("supertest");
const app = require("../index"); // Make sure this path is correct
const User = require("../models/user");
const mongoose = require("mongoose");

// --- Test Data ---
const TEST_USER_DATA = {
  fullName: "Ram Bahadur",
  email: "ram.bahadur.test@example.com",
  phone_number: "9811111111",
  password: "password123",
  role: "Customer",
};

// --- Test Hooks ---
afterAll(async () => {
  // Cleans up all test users created
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await mongoose.disconnect();
});

// --- Test Suites ---

describe("User Registration API", () => {
  beforeAll(async () => {
    // Ensure the main test user is clean before starting
    await User.deleteOne({ email: TEST_USER_DATA.email });
  });

  test("1. Should NOT create user with missing required fields (e.g., email)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Incomplete User",
      phone_number: "9800000000",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Missing required fields");
  });

  test("2. Should create a valid user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send(TEST_USER_DATA);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("3. Should NOT allow duplicate user registration with the same phone number", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...TEST_USER_DATA, email: "another.email@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists with this phone number");
  });
});

describe("User Authentication and Authorization", () => {
  beforeAll(async () => {
    // We still need to create and promote the user to an Admin for Test #6 to work
    await User.updateOne({ email: TEST_USER_DATA.email }, { $set: { role: "Admin" } }, { upsert: true });
  });

  test("4. Should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email,
      password: TEST_USER_DATA.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("5. Should NOT login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  test("6. Should NOT allow a non-admin user to access admin routes", async () => {
    // Create a new, non-admin user
    const customerData = {
      fullName: "Regular Customer",
      email: "customer@example.com",
      phone_number: "9822222222",
      password: "password123",
      role: "Customer",
    };
    await request(app).post("/api/auth/register").send(customerData);

    // Log in as the non-admin user to get their token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: customerData.email,
      password: customerData.password,
    });
    const customerToken = loginRes.body.token;

    // Attempt to access an admin route with the customer token
    const res = await request(app).get("/api/admin/user").set("Authorization", "Bearer " + customerToken);

    // Expect a 403 Forbidden error because the isAdmin middleware is working correctly for non-admins
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});