const router = require('express').Router()
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

// Create a new post (lost or found item)
router.post('/create', async (req, res) => {
  try {
    const { type, item, contact, messenger, description, imageUrl, user, userId, avatar } = req.body

    if (!type || !item || !contact || !messenger || !description || !user || !userId) {
      return res.status(400).json({ message: 'All required fields must be provided' })
    }

    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({ message: 'Type must be either "lost" or "found"' })
    }

    const postData = {
      item,
      contact,
      messenger,
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

// Get all posts
router.get('/all', async (req, res) => {
  try {
    const lostPosts = await LostItem.find().sort({ createdAt: -1 }).populate('userId')
    const foundPosts = await FoundItem.find().sort({ createdAt: -1 }).populate('userId')

    // Add type field to posts for consistency
    const formattedLostPosts = lostPosts.map(post => ({ ...post.toObject(), type: 'lost' }))
    const formattedFoundPosts = foundPosts.map(post => ({ ...post.toObject(), type: 'found' }))

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

    let posts;
    if (type === 'lost') {
      posts = await LostItem.find().sort({ createdAt: -1 }).populate('userId')
    } else {
      posts = await FoundItem.find().sort({ createdAt: -1 }).populate('userId')
    }

    // Add type field for consistency
    const formattedPosts = posts.map(post => ({ ...post.toObject(), type }))

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

    const lostPosts = await LostItem.find({ userId }).sort({ createdAt: -1 }).populate('userId')
    const foundPosts = await FoundItem.find({ userId }).sort({ createdAt: -1 }).populate('userId')

    // Add type field to posts
    const formattedLostPosts = lostPosts.map(post => ({ ...post.toObject(), type: 'lost' }))
    const formattedFoundPosts = foundPosts.map(post => ({ ...post.toObject(), type: 'found' }))

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
    let post = await LostItem.findById(id).populate('userId')
    let type = 'lost'

    if (!post) {
      post = await FoundItem.findById(id).populate('userId')
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
