const router = require('express').Router()
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

// === NEW: Update (Mark as Found) ===
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.body

    // We only support converting 'lost' -> 'found' here
    if (type === 'found') {
      // 1. Find the item in the 'LostItem' collection
      const lostItem = await LostItem.findById(id)

      if (!lostItem) {
        // If not in LostItem, check if it's already in FoundItem just to be safe
        const alreadyFound = await FoundItem.findById(id)
        if (alreadyFound) {
          return res.status(200).json(alreadyFound)
        }
        return res.status(404).json({ message: 'Post not found' })
      }

      // 2. Create new data object for FoundItem collection
      // (Mongoose documents are objects, but we want the raw data)
      const itemData = lostItem.toObject()
      delete itemData._id // Remove old ID so a new one is generated, OR keep it if you want same ID
      // Usually better to let Mongo generate a new ID, or explicitly set _id: itemData._id
      // Let's keep the ID consistent if your logic relies on it, otherwise delete it.
      // For now, let's just copy the fields we need explicitly to avoid _id collisions if not handled right.
      
      const newItemData = {
        item: itemData.item,
        contact: itemData.contact,
        messenger: itemData.messenger,
        location: itemData.location,
        description: itemData.description,
        imageUrl: itemData.imageUrl,
        user: itemData.user,
        userId: itemData.userId,
        avatar: itemData.avatar,
        // Found items might not need all fields, but copying is safer
      }

      // 3. Create the item in FoundItem collection
      const newFoundItem = await FoundItem.create(newItemData)

      // 4. Delete the item from LostItem collection
      await LostItem.findByIdAndDelete(id)

      return res.status(200).json(newFoundItem)
    }

    res.status(400).json({ message: 'Invalid update type' })

  } catch (error) {
    console.error(error)
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