const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const path = require('path')
const fs = require('fs')
// serve uploaded files (the folder is gitignored, so create it on first run)
const uploadsDir = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/uploads', express.static(uploadsDir))

// Connect to MongoDB, retrying if the first attempt fails
// (Mongoose does not retry the initial connection on its own)
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.log('MongoDB connection failed, retrying in 5s:', err.message)
      setTimeout(connectDB, 5000)
    })
}
connectDB()

app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000')
})
