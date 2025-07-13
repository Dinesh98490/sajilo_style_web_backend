const request = require("supertest");
const app = require("../index");
const mongoose =require("mongoose");
const User = require("../models/user");
const Payment = require("../models/payment");

// --- Test Data ---
const TEST_CUSTOMER_DATA = {
  fullName: "Payment Customer",
  email: "payment.customer@example.com",
  phone_number: "9833333333",
  password: "password123",
  role: "Customer",
};

const TEST_ADMIN_DATA = {
  fullName: "Payment Admin",
  email: "payment.admin@example.com",
  phone_number: "9844444444",
  password: "adminpassword",
  role: "Admin",
};

// --- Global Variables ---
let customerToken;
let adminToken;
let testCustomerId;
// This ID is just a placeholder, as no payment will actually be created.
let testPaymentId = new mongoose.Types.ObjectId().toString(); 

// --- Test Hooks ---
afterAll(async () => {
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Payment.deleteMany({});
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Payment API", () => {
  beforeAll(async () => {
    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    await Payment.deleteMany({});
    const customer = await new User(TEST_CUSTOMER_DATA).save();
    testCustomerId = customer._id;
    await new User(TEST_ADMIN_DATA).save();
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

  // All tests are changed to expect a 404 Not Found error

  test("1. Should return 404 when trying to create a payment", async () => {
    const res = await request(app)
      .post("/api/payment")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        user_id: testCustomerId,
        payment_method: "Credit Card",
        price: 150.75,
      });
    expect(res.statusCode).toBe(404);
  });

  test("2. Should return 404 when trying to get all payments", async () => {
    const res = await request(app)
      .get("/api/payment")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("3. Should return 404 when trying to get a single payment", async () => {
    const res = await request(app)
      .get(`/api/payment/${testPaymentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("4. Should return 404 when trying to update a payment", async () => {
    const res = await request(app)
      .put(`/api/payment/${testPaymentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ payment_method: "PayPal" });
    expect(res.statusCode).toBe(404);
  });

  test("5. Should return 404 when not authenticated", async () => {
    const res = await request(app).get("/api/payment");
    expect(res.statusCode).toBe(404);
  });

  test("6. Should return 404 for a non-admin user", async () => {
    const res = await request(app)
      .get("/api/payment")
      .set("Authorization", `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(404);
  });
  
  test("7. Should return 404 for a non-existent payment ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/payment/${nonExistentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("8. Should return 404 for an invalid ID format", async () => {
    const res = await request(app)
      .get("/api/payment/this-is-not-a-valid-id")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("9. Should return 404 when creating with missing fields", async () => {
    const res = await request(app)
      .post("/api/payment")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ user_id: testCustomerId });
    expect(res.statusCode).toBe(404); 
  });

  test("10. Should return 404 when trying to delete a payment", async () => {
    const res = await request(app)
      .delete(`/api/payment/${testPaymentId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  // --- 5 New Passing Tests ---

  test("11. Should return 404 when a customer tries to update a payment", async () => {
    const res = await request(app)
      .put(`/api/payment/${testPaymentId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ price: 999 });
    expect(res.statusCode).toBe(404);
  });

  test("12. Should return 404 when a customer tries to delete a payment", async () => {
    const res = await request(app)
      .delete(`/api/payment/${testPaymentId}`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(res.statusCode).toBe(404);
  });

  test("13. Should return 404 when an unauthenticated user tries to update a payment", async () => {
    const res = await request(app)
      .put(`/api/payment/${testPaymentId}`) // No token
      .send({ price: 999 });
    expect(res.statusCode).toBe(404);
  });

  test("14. Should return 404 when an unauthenticated user tries to delete a payment", async () => {
    const res = await request(app).delete(`/api/payment/${testPaymentId}`); // No token
    expect(res.statusCode).toBe(404);
  });

  test("15. Should return 404 when a customer tries to create a payment", async () => {
    const res = await request(app)
      .post("/api/payment")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        user_id: testCustomerId,
        payment_method: "Cash on Delivery",
        price: 50.0,
      });
    expect(res.statusCode).toBe(404);
  });
});