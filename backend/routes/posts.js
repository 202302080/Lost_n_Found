const router = require('express').Router()
const LostItem = require('../models/LostItem')
const FoundItem = require('../models/FoundItem')

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const { type, item, contact, messenger, location, description, imageUrl, user, userId, avatar } = req.body

    if (!type || !item || !contact || !messenger || !location || !description || !user || !userId) {
      return res.status(400).json({ message: 'All required fields must be provided' })
    }

    const postData = {
      item, contact, messenger, location, description,
      imageUrl: imageUrl || null,
      user, userId,
      avatar: avatar || 'https://randomuser.me/api/portraits/men/1.jpg',
    }

    let newPost;
    if (type === 'lost') {
      newPost = await LostItem.create(postData)
    } else {
      newPost = await FoundItem.create(postData)
    }

    res.status(201).json({ message: 'Post created successfully', post: newPost })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all posts (Merged)
router.get('/all', async (req, res) => {
  try {
    const lostPosts = await LostItem.find().sort({ createdAt: -1 }).populate('userId')
    const foundPosts = await FoundItem.find().sort({ createdAt: -1 }).populate('userId')

    const formattedLost = lostPosts.map(p => ({ ...p.toObject(), type: 'lost' }))
    const formattedFound = foundPosts.map(p => ({ ...p.toObject(), type: 'found' }))

    const allPosts = [...formattedLost, ...formattedFound].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )

    res.json({ message: 'All posts retrieved', posts: allPosts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get posts by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params
    let posts;
    if (type === 'lost') {
      posts = await LostItem.find().sort({ createdAt: -1 }).populate('userId')
    } else if (type === 'found') {
      posts = await FoundItem.find().sort({ createdAt: -1 }).populate('userId')
    } else {
      return res.status(400).json({ message: 'Invalid type' })
    }

    const formattedPosts = posts.map(p => ({ ...p.toObject(), type }))
    res.json({ message: `${type} items retrieved`, posts: formattedPosts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// === LOGIC TO DELETE ON MARK AS FOUND ===
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.body

    // If marked as 'found', DELETE it from LostItem collection
    if (type === 'found') {
      const deletedPost = await LostItem.findByIdAndDelete(id)

      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found or already deleted' })
      }

      return res.status(200).json({ 
        message: 'Item recovered and removed from listing', 
        post: deletedPost 
      })
    }

    res.status(400).json({ message: 'Invalid action' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
})

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    let post = await LostItem.findByIdAndDelete(id)
    if (!post) post = await FoundItem.findByIdAndDelete(id)

    if (!post) return res.status(404).json({ message: 'Post not found' })

    res.json({ message: 'Post deleted successfully', post })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router