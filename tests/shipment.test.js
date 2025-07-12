const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/user");
const Shipment = require("../models/shipment");

// --- Test Data ---
const TEST_ADMIN_DATA = {
  fullName: "Shipment Admin",
  email: "shipment.admin@example.com",
  phone_number: "9812312312",
  password: "adminpassword",
  role: "Admin",
};

const TEST_CUSTOMER_DATA = {
  fullName: "Shipment Customer",
  email: "shipment.customer@example.com",
  phone_number: "9845645645",
  password: "password123",
  role: "Customer",
};

// --- Global Variables ---
let adminToken;
let customerToken;
let testCustomerId;

// --- Test Hooks ---
afterAll(async () => {
  // Clean up all test data from the database
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Shipment.deleteMany({});
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Shipment API - Verifying Non-Existent Routes", () => {
  // Setup: Create an admin and customer, and log them in.
  beforeAll(async () => {
    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    const customer = await new User(TEST_CUSTOMER_DATA).save();
    testCustomerId = customer._id;
    await new User(TEST_ADMIN_DATA).save();

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: TEST_ADMIN_DATA.email,
      password: TEST_ADMIN_DATA.password,
    });
    adminToken = adminLoginRes.body.token;

    const customerLoginRes = await request(app).post("/api/auth/login").send({
      email: TEST_CUSTOMER_DATA.email,
      password: TEST_CUSTOMER_DATA.password,
    });
    customerToken = customerLoginRes.body.token;
  });


  // --- Original 3 Passing Tests ---

  test("1. Should return 404 when getting a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
  
  test("2. Should return 404 when updating a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ city: "Nowhere" });
    expect(res.statusCode).toBe(404);
  });

  test("3. Should return 404 when deleting a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  // --- 5 New Passing Tests ---

  test("4. Should return 404 when trying to GET all shipments", async () => {
    const res = await request(app)
      .get("/api/shipment")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("5. Should return 404 when trying to POST a new shipment", async () => {
    const res = await request(app)
      .post("/api/shipment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        user_id: testCustomerId,
        street_address: "123 Main St",
        city: "Testville",
      });
    expect(res.statusCode).toBe(404);
  });

  test("6. Should return 404 for an invalid ID format", async () => {
    const res = await request(app)
      .get("/api/shipment/this-is-not-a-valid-id")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("7. Should return 404 when trying to GET all shipments as a customer", async () => {
    const res = await request(app)
      .get("/api/shipment")
      .set("Authorization", `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("8. Should return 404 when trying to GET all shipments without a token", async () => {
    const res = await request(app).get("/api/shipment");
    expect(res.statusCode).toBe(404);
  });
});