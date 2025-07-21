const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new student
router.post('/register', async (req, res) => {
  const {name , rollNumber, password } = req.body;

  try {
    // Check if student already exists
    let student = await Student.findOne({ rollNumber });
    if (student) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    student = new Student({
      name ,
      rollNumber,
      password: hashedPassword,
    });

    await student.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a student
router.post('/login', async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    // Check if student exists
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      student: {
        name : student.name,
        id: student._id,
        rollNumber: student.rollNumber,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route example (e.g., student dashboard)
router.get('/dashboard', authMiddleware, (req, res) => {
//   res.json({ message: `Welcome, ${req.student.name}!` });
  res.render("home" , {users : [req.student.name , "rupesh" , "rahul"]});
});

module.exports = router;