const request = require("supertest");
const app = require("../index"); // Make sure this path is correct
const User = require("../models/user");
const mongoose = require("mongoose");

// --- Test Data ---
// Using a constant object for test data makes the tests cleaner and easier to manage.
const TEST_USER_DATA = {
  fullName: "Ram Bahadur",
  email: "ram.bahadur.test@example.com", // Using a unique test email
  phone_number: "9811111111",
  password: "password123",
  role: "Customer", // Users should register as 'Customer' by default
};

// --- Global Variables ---
// These will be set and used across different tests within the suites.
let authToken;
let testUserId;

// --- Test Hooks ---
// This runs once after all tests in this file have completed.
afterAll(async () => {
  // Clean up the database by deleting the user created during the tests.
  await User.deleteOne({ email: TEST_USER_DATA.email });
  // Disconnect from the database to allow the Jest process to exit cleanly.
  await mongoose.disconnect();
});

// --- Test Suites ---

describe("User Registration API", () => {
  // This runs once before any tests in this 'describe' block.
  beforeAll(async () => {
    // Ensure the test user is deleted before we begin, in case a previous test run failed.
    await User.deleteOne({ email: TEST_USER_DATA.email });
  });

  test("1. Should NOT create user with missing required fields (e.g., email)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      fullName: "Incomplete User",
      phone_number: "9800000000",
      password: "password123",
      // 'email' field is intentionally missing
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    // This message must match the one in your registerUser controller.
    expect(res.body.message).toBe("Missing required fields");
  });

  test("2. Should create a valid user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(TEST_USER_DATA);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  test("3. Should NOT allow duplicate user registration with the same phone number", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...TEST_USER_DATA, email: "another.email@example.com" }); // Same phone, different email

    expect(res.statusCode).toBe(400);
    // This message comes directly from your controller's logic for existing users.
    expect(res.body.message).toBe("User already exists with this phone number");
  });
});

describe("User Authentication and Admin Routes API", () => {
  // This runs once before the authentication and admin tests.
  beforeAll(async () => {
    // Step 1: Promote the user to an 'Admin'. This is crucial.
    // The role 'Admin' (uppercase A) must match what your isAdmin middleware checks.
    await User.updateOne(
      { email: TEST_USER_DATA.email },
      { $set: { role: "Admin" } }
    );

    // Step 2: Log in as the now-admin user to get a valid token.
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email, // Login uses email
      password: TEST_USER_DATA.password,
    });
    
    // Store the token for use in protected route tests.
    authToken = res.body.token;
  });

  test("4. Should login successfully with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email, // Login uses email
      password: TEST_USER_DATA.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("5. Should NOT login with incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: TEST_USER_DATA.email, // Login uses email
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });


 


});