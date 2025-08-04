const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

const authRoutes = require('./routes/auth');

app.set('view engine', 'ejs');
app.set('views', './view');


app.use('/api/auth' , authRoutes);

app.use('/' , (req ,res)=>{
  res.render("Login");
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// i was working on this file 
// my plan was to give authorisation to the admin only to register new users ,so i removed the registration route to use it directly 
// for registering student , use post man 