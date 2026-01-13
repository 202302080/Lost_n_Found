const router = require('express').Router()
const User = require('../models/User')
const multer = require('multer')
const path = require('path')

// setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.round(Math.random()*1E9)}${ext}`
    cb(null, name)
  }
})

const upload = multer({ storage })

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

// Profile picture upload route
router.post('/profile-picture', upload.single('picture'), async (req, res) => {
  try {
    const userId = req.body.userId
    if (!userId) return res.status(400).json({ message: 'userId required' })
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const fileUrl = `${process.env.SERVER_URL ?? 'http://localhost:5000'}/uploads/${req.file.filename}`

    const user = await User.findByIdAndUpdate(userId, { profilePic: fileUrl }, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'Profile picture updated', user: { id: user._id, profilePic: user.profilePic } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update user's first and/or last name
router.put('/update-name', async (req, res) => {
  try {
    const { userId, firstName, lastName } = req.body
    if (!userId) return res.status(400).json({ message: 'userId required' })
    if (!firstName && !lastName) return res.status(400).json({ message: 'firstName or lastName required' })

    const update = {}
    if (firstName) update.firstName = firstName
    if (lastName) update.lastName = lastName

    const user = await User.findByIdAndUpdate(userId, update, { new: true })
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'Name updated', user: { id: user._id, firstName: user.firstName, lastName: user.lastName } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
