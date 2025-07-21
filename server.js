const express = require("express");
const mongoose = require("mongoose");
const app = express();

require('dotenv').config();

const authRoutes = require('./routes/auth');
const authMiddleware = require("./middleware/authMiddleware");

app.set('view engine', 'ejs');
app.set('views', './view');

app.use(express.json());


app.use('/api/auth' , authRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));