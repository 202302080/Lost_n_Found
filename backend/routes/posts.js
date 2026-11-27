const router = require('express').Router()
const mongoose = require('mongoose')
require('../models/User') // registers the User model used by populate('userId')
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

// Create a new post (lost or found item)
router.post('/create', async (req, res) => {
  try {
    const { type, item, contact, messenger, location, description, imageUrl, user, userId, avatar } = req.body

    if (!type || !item || !contact || !messenger || !location || !description || !user || !userId) {
      return res.status(400).json({ message: 'All required fields must be provided' })
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "lost" or "found"' })
    }

    const postData = {
      item,
      contact,
      messenger,
      location,
      description,
      imageUrl: imageUrl || null,
      user,
      userId,
      avatar: avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
    }

    let newPost;
    if (type === 'lost') {
      newPost = await LostItem.create(postData)
    } else {
      newPost = await FoundItem.create(postData)
    }

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Post images are stored in the database as base64 "data:" strings, which can be
// hundreds of KB each. Lists must not carry them (a list of ~15 posts was 7 MB and
// froze the app), so list routes cut imageUrl short and replace base64 images with
// a link to GET /api/posts/:id/image, which serves the picture on its own.
const LIST_FIELDS = {
  item: 1, contact: 1, messenger: 1, location: 1, description: 1,
  user: 1, userId: 1, avatar: 1, createdAt: 1, updatedAt: 1,
  imageUrl: { $substrCP: [{ $ifNull: ['$imageUrl', ''] }, 0, 2000] },
}

const toListPost = (post, type) => {
  let imageUrl = post.imageUrl || null
  if (imageUrl && imageUrl.startsWith('data:')) {
    // version the link with updatedAt so an edited image is not served from cache
    imageUrl = `/api/posts/${post._id}/image?v=${new Date(post.updatedAt || 0).getTime()}`
  }
  return { ...post, imageUrl, type }
}

const listPosts = async (Model, filter, type) => {
  const posts = await Model.find(filter, LIST_FIELDS)
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName profilePic')
    .lean()
  return posts.map(post => toListPost(post, type))
}

// Serve a post's image as a real image file
router.get('/:id/image', async (req, res) => {
  try {
    const { id } = req.params
    const post = (await LostItem.findById(id, 'imageUrl').lean()) || (await FoundItem.findById(id, 'imageUrl').lean())
    const imageUrl = post && post.imageUrl
    if (!imageUrl) return res.status(404).json({ message: 'Image not found' })

    const match = /^data:([^;,]+)?(;base64)?,([\s\S]*)$/.exec(imageUrl)
    if (!match) return res.redirect(imageUrl) // already a normal URL

    const body = match[2] ? Buffer.from(match[3], 'base64') : Buffer.from(decodeURIComponent(match[3]))
    res.set('Content-Type', match[1] || 'image/jpeg')
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(body)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all posts
router.get('/all', async (req, res) => {
  try {
    const formattedLostPosts = await listPosts(LostItem, {}, 'lost')
    const formattedFoundPosts = await listPosts(FoundItem, {}, 'found')

    // Combine and sort by creation date
    const allPosts = [...formattedLostPosts, ...formattedFoundPosts].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    res.json({
      message: 'All posts retrieved successfully',
      posts: allPosts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get posts by type (lost or found)
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "lost" or "found"' })
    }

    const formattedPosts = await listPosts(type === 'lost' ? LostItem : FoundItem, {}, type)

    res.json({
      message: `${type} items retrieved successfully`,
      posts: formattedPosts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get posts by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }

    const formattedLostPosts = await listPosts(LostItem, { userId }, 'lost')
    const formattedFoundPosts = await listPosts(FoundItem, { userId }, 'found')

    // Combine and sort by creation date
    const userPosts = [...formattedLostPosts, ...formattedFoundPosts].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    res.json({
      message: 'User posts retrieved successfully',
      posts: userPosts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Try to find in LostItem first, then FoundItem
    let post = await LostItem.findById(id).populate('userId', 'firstName lastName profilePic')
    let type = 'lost'

    if (!post) {
      post = await FoundItem.findById(id).populate('userId', 'firstName lastName profilePic')
      type = 'found'
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const postWithType = { ...post.toObject(), type }

    res.json({
      message: 'Post retrieved successfully',
      post: postWithType,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Try to delete from LostItem first, then FoundItem
    let post = await LostItem.findByIdAndDelete(id)

    if (!post) {
      post = await FoundItem.findByIdAndDelete(id)
    }

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json({
      message: 'Post deleted successfully',
      post,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
