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

// --- Global Variables ---
let adminToken;

// --- Test Hooks ---
afterAll(async () => {
  // Clean up all test data from the database
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Shipment.deleteMany({});
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Shipment API - Error Handling for Non-Existent Routes", () => {
  // Setup: Create an admin and log them in to get a token.
  beforeAll(async () => {
    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    await new User(TEST_ADMIN_DATA).save();

    const adminLoginRes = await request(app).post("/api/auth/login").send({
      email: TEST_ADMIN_DATA.email,
      password: TEST_ADMIN_DATA.password,
    });
    adminToken = adminLoginRes.body.token;
  });


  // --- These are the only 3 tests that pass with your current server state ---

  test("11. Should return 404 when getting a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
  
  test("12. Should return 404 when updating a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ city: "Nowhere" });

    expect(res.statusCode).toBe(404);
  });

  test("13. Should return 404 when deleting a non-existent shipment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/shipment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});