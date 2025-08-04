const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  const {name , rollNumber, password } = req.body;
  
  try {

    let student = await Student.findOne({ rollNumber });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    student = new Student({
      name ,
      rollNumber,
      password: hashedPassword,
    });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;

  try {

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.redirect('/');
    }

   

    const token = student.GenerateAuthToken();
    res.cookie('authtoken', token, {
  httpOnly: true,            
  maxAge: 60 * 60*1000 
})


  if(student.isAdmin){
      res.redirect('/api/auth/Admindashboard');
  }
  else{
      res.redirect('/api/auth/dashboard');
  }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/Admindashboard', authMiddleware, (req, res) => {
  res.render("home" , {users : [req.student.name + " Admin"]});
});
router.get('/dashboard', authMiddleware, async (req, res) => {
  // i was checking if it is working or not 
  // next step was to create room collection and the recent collection so that i can pass data from the collection
  const rooms = [
    { name: "Room A", capacity: 10, status: "Available" },
    { name: "Room B", capacity: 20, status: "Occupied" },
    { name: "Room B", capacity: 20, status: "Occupied" },
    { name: "Room B", capacity: 20, status: "Occupied" },
    { name: "Room B", capacity: 20, status: "Occupied" }
  ];
  const recentBookings = [
    { id: "BK001", roomName: "Room A" },
    { id: "BK002", roomName: "Room B" }
  ];

  res.render("Admindashboard", { rooms, recentBookings });
});

module.exports = router;