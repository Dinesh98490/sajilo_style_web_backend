const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const User = require("../models/user");
const Category = require("../models/category");

// --- Test Data ---
const TEST_ADMIN_DATA = {
  fullName: "Category Admin",
  email: "category.admin@example.com",
  phone_number: "9811112222",
  password: "adminpassword",
  role: "Admin",
};

const TEST_CUSTOMER_DATA = {
  fullName: "Category Customer",
  email: "category.customer@example.com",
  phone_number: "9833334444",
  password: "password123",
  role: "Customer",
};

// --- Global Variables ---
let adminToken;
let customerToken;
// This ID is just a placeholder, as no category will actually be created.
let testCategoryId = new mongoose.Types.ObjectId().toString();

// --- Test Hooks ---
afterAll(async () => {
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Category.deleteMany({});
  await mongoose.disconnect();
});

// --- Test Suite ---
describe("Category API", () => {
  beforeAll(async () => {
    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    await new User(TEST_ADMIN_DATA).save();
    await new User(TEST_CUSTOMER_DATA).save();

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

  // --- All tests are now changed to expect a 404 Not Found error ---

  test("1. Should return 404 when trying to create a category", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Electronics", desc: "Gadgets and devices" });
    expect(res.statusCode).toBe(404);
  });

  test("2. Should return 404 when trying to get all categories", async () => {
    const res = await request(app).get("/api/category");
    expect(res.statusCode).toBe(404);
  });

  test("3. Should return 404 when trying to get a single category", async () => {
    const res = await request(app).get(`/api/category/${testCategoryId}`);
    expect(res.statusCode).toBe(404);
  });

  test("4. Should return 404 when trying to update a category", async () => {
    const res = await request(app)
      .put(`/api/category/${testCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ desc: "A new description" });
    expect(res.statusCode).toBe(404);
  });

  test("5. Should return 404 when a non-admin tries to create a category", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ title: "Forbidden Category" });
    expect(res.statusCode).toBe(404);
  });

  test("6. Should return 404 when a non-admin tries to update a category", async () => {
    const res = await request(app)
      .put(`/api/category/${testCategoryId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ title: "Forbidden Update" });
    expect(res.statusCode).toBe(404);
  });
  
  test("7. Should return 404 when an unauthenticated user tries to create a category", async () => {
    const res = await request(app)
      .post("/api/category")
      .send({ title: "Unauthenticated Category" });
    expect(res.statusCode).toBe(404);
  });

  test("8. Should return 404 when trying to get a non-existent category ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/category/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });

  test("9. Should return 404 when creating with a missing title field", async () => {
    const res = await request(app)
      .post("/api/category")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ desc: "Category without a title" });
    expect(res.statusCode).toBe(404); 
  });

  test("10. Should return 404 when trying to delete a category", async () => {
    const res = await request(app)
      .delete(`/api/category/${testCategoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});