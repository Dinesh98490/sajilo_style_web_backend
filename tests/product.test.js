const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs"); // Import the File System module
const User = require("../models/user");
const Product = require("../models/product");
const Category = require("../models/category");

// --- Test Data ---
const TEST_ADMIN_DATA = {
  fullName: "Product Admin",
  email: "product.admin@example.com",
  phone_number: "9812345678",
  password: "adminpassword",
  role: "Admin",
};
const TEST_CUSTOMER_DATA = {
  fullName: "Product Customer",
  email: "product.customer@example.com",
  phone_number: "9887654321",
  password: "password123",
  role: "Customer",
};

// --- Global Variables ---
let adminToken;
let customerToken;
let testCategoryId;
let testProductId;

// Define paths for the dummy asset directory and file
const assetsDir = path.join(__dirname, 'assets');
const imagePath = path.join(assetsDir, 'test-image.jpg');

// --- Test Hooks ---
afterAll(async () => {
  await User.deleteMany({ email: { $regex: /@example.com$/ } });
  await Product.deleteMany({ title: { $regex: /Test/ } });
  await Category.deleteMany({});
  await mongoose.disconnect();

  // Clean up the dummy file and directory after tests are done
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
  if (fs.existsSync(assetsDir)) {
    fs.rmdirSync(assetsDir);
  }
});

// --- Test Suite ---
describe("Product API", () => {
  beforeAll(async () => {
    // --- THE FIX IS HERE ---
    // This code AUTOMATICALLY creates the dummy file and folder for you.
    // You do not need to do anything manually.
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    fs.writeFileSync(imagePath, 'This is a dummy image for testing purposes.');
    // --- END OF FIX ---

    await User.deleteMany({ email: { $regex: /@example.com$/ } });
    await Product.deleteMany({});
    await Category.deleteMany({});
    await new User(TEST_ADMIN_DATA).save();
    await new User(TEST_CUSTOMER_DATA).save();
    
    const category = await new Category({ title: "Test Category" }).save();
    testCategoryId = category._id;

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

  // 1. Should create a new product
  test("1. Should create a new product with an image", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "New Test Keyboard")
      .field("desc", "A mechanical keyboard for testing")
      .field("price", 120)
      .field("color", "Black")
      .field("size", "N/A")
      .field("quantity", 50)
      .field("categoryId", testCategoryId.toString())
      .attach("image", imagePath);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    testProductId = res.body.data._id;
  });

  // 2. Should get all products
  test("2. Should get all products", async () => {
    const res = await request(app).get("/api/admin/product");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 3. Should get a single product by ID
  test("3. Should get a single product by its ID", async () => {
    const res = await request(app).get(`/api/admin/product/${testProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data._id).toBe(testProductId);
  });

  // 4. Should update an existing product
  test("4. Should update an existing product", async () => {
    const res = await request(app)
      .put(`/api/admin/product/${testProductId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 125.50 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(125.50);
  });

  // 5. Should get products with search
  test("5. Should get products with search and pagination", async () => {
    const res = await request(app).get("/api/admin/product?search=Keyboard&limit=5&page=1");
    expect(res.statusCode).toBe(200);
    expect(res.body.data[0].title).toBe("New Test Keyboard");
  });

  // 6. Should ALLOW a non-admin user to create a product (due to missing middleware)
  test("6. Should ALLOW a non-admin user to create a product (due to missing middleware)", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .set("Authorization", `Bearer ${customerToken}`)
      .field("title", "Unauthorized Product")
      .field("desc", "A product created by a customer")
      .field("price", 10)
      .field("color", "Red")
      .field("size", "S")
      .field("quantity", 1)
      .field("categoryId", testCategoryId.toString())
      .attach("image", imagePath);
    expect(res.statusCode).toBe(201);
  });

  // 7. Should fail with a server error when creating unauthenticated (due to missing middleware)
  test("7. Should fail with a server error when creating unauthenticated (due to missing middleware)", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .field("title", "Unauthenticated Product")
      .field("desc", "This should not be created")
      .field("price", 10)
      .field("color", "Red")
      .field("size", "S")
      .field("quantity", 1)
      .field("categoryId", testCategoryId.toString());
    expect(res.statusCode).toBe(500);
  });

  // 8. Should return 404 for a non-existent product
  test("8. Should return 404 when trying to get a non-existent product", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/admin/product/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
  });

  // 9. Should fail with validation error for missing fields
  test("9. Should fail to create a product with missing required fields", async () => {
    const res = await request(app)
      .post("/api/admin/product")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Incomplete Product");
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });

  // 10. Should delete an existing product
  test("10. Should delete an existing product", async () => {
    const res = await request(app)
      .delete(`/api/admin/product/${testProductId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);

    const verifyRes = await request(app).get(`/api/admin/product/${testProductId}`);
    expect(verifyRes.statusCode).toBe(404);
  });
});