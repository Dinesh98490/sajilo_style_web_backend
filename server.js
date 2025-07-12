require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./index');
const PORT = process.env.PORT || 5050;
const CONNECTION_STRING = process.env.MONGODB_URI;

mongoose.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log('Sajilo Style running on server', PORT);
    });
    console.log('Mongodb connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 
  