const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

const path = require('path')
// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
