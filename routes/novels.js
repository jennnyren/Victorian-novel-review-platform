const express = require('express');
const router = express.Router();
const Novel = require('../models/novel');
const Review = require('../models/review');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');

// GET /novels — index all novels
router.get('/novels', async (req, res) => {
  try {
    const novels = await Novel.find();
    res.render('novels/index', { novels });
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// GET /novels/new — show create form (admin only)
router.get('/novels/new', isAdmin, (req, res) => {
  res.send('Add novel form coming soon');
});

// POST /novels — create new novel (admin only)
router.post('/novels', isAdmin, async (req, res) => {
  try {
    const { title, author, year, genre, description } = req.body;
    const novel = new Novel({ title, author, year, genre, description });
    await novel.save();
    res.redirect('/novels');
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// GET /novels/:id — show single novel with reviews
router.get('/novels/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
          select: 'username'    // only fetch username, not password
        }
      });

    if (!novel) {
      return res.send('Novel not found');
    }

    res.render('novels/show', { novel });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// GET /novels/:id/edit — show edit form (admin only)
router.get('/novels/:id/edit', isAdmin, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.send('Novel not found');
    }
    res.json(novel);    // temporary — will pass to view later
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// PUT /novels/:id — update novel (admin only)
router.put('/novels/:id', isAdmin, async (req, res) => {
  try {
    const { title, author, year, genre, description } = req.body;
    const novel = await Novel.findByIdAndUpdate(
      req.params.id,
      { title, author, year, genre, description },
      { new: true, runValidators: true }
    );
    if (!novel) {
      return res.send('Novel not found');
    }
    res.redirect(`/novels/${novel._id}`);
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// DELETE /novels/:id — delete novel and all its reviews (admin only)
router.delete('/novels/:id', isAdmin, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.send('Novel not found');
    }

    // delete all associated reviews first
    await Review.deleteMany({ novel: req.params.id });

    // then delete the novel
    await Novel.findByIdAndDelete(req.params.id);

    res.redirect('/novels');
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

module.exports = router;