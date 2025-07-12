require('dotenv').config({ path: '../.env' });
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'testsecret'; // fallback for test environments
const request = require('supertest');
const app = require('../index'); // Make sure your index.js exports the app
const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');

let token, userId, productId, cartId;

describe('Cart API', () => {
  beforeAll(async () => {
    // await mongoose.connect('mongodb://localhost:27017/sajilo_style_test', { useNewUrlParser: true, useUnifiedTopology: true });
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    // Create a test user and product
    const user = await User.create({ fullName: 'Test User', email: 'test@example.com', password: 'test123', phone_number: '1234567890', role: 'Customer' });
    userId = user._id;
    token = jwt.sign({ _id: userId }, process.env.JWT_SECRET); // Use the same secret as backend
    console.log('Test user:', user);
    console.log('JWT token:', token);
    const product = await Product.create({ title: 'Test Product', desc: 'desc', price: 100, image: 'test.jpg', color: 'red', size: 'M', quantity: 10, categoryId: new mongoose.Types.ObjectId() });
    productId = product._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a cart item', async () => {
    const res = await request(app)
      .post('/api/customer/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: productId,
        total_price: 100,
        total_product: 1,
        discount: 0
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    cartId = res.body.data._id;
  });

  it('should get cart items for the user', async () => {
    const res = await request(app)
      .get('/api/customer/cart')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should update a cart item', async () => {
    const res = await request(app)
      .put(`/api/customer/cart/${cartId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ total_product: 2 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total_product).toBe(2);
  });

  it('should not update a cart item with invalid id', async () => {
    const res = await request(app)
      .put(`/api/customer/cart/invalidid`)
      .set('Authorization', `Bearer ${token}`)
      .send({ total_product: 2 });
    expect(res.statusCode).toBe(500);
  });

  it('should delete a cart item', async () => {
    const res = await request(app)
      .delete(`/api/customer/cart/${cartId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should not delete a cart item with invalid id', async () => {
    const res = await request(app)
      .delete(`/api/customer/cart/invalidid`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400); // Expect 400 for invalid ObjectId
  });

  // Add more tests for edge cases, unauthorized, missing fields, etc.
  it('should not create a cart item without auth', async () => {
    const res = await request(app)
      .post('/api/customer/cart')
      .send({
        product_id: productId,
        total_price: 100,
        total_product: 1,
        discount: 0
      });
    expect(res.statusCode).toBe(401);
  });

  it('should not create a cart item with missing fields', async () => {
    const res = await request(app)
      .post('/api/customer/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400); // Expect 400 for missing required fields
  });

  // Add more tests as needed to reach 50+ (e.g., test limits, pagination, search, etc.)
}); 