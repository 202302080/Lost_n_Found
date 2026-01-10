const router = require('express').Router()
const User = require('../models/User')

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body


    if (!firstName || !lastName || !email|| !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }


    if (!email.endsWith('@cvsu.edu.ph')) {
      return res.status(400).json({ message: 'Only CVSU email addresses are allowed' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password, 
    })
    console.log('Created user:', user);
        
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findOne({ email })

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

module.exports = router
