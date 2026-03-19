const express = require('express');
const router = express.Router();
const Novel = require('../models/novel');
const Review = require('../models/review');
const isLoggedIn = require('../middleware/isLoggedIn');

// POST /novels/:id/reviews — create review
router.post('/novels/:id/reviews', isLoggedIn, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.send('Novel not found');
    }

    const { body, rating } = req.body;

    // Step 1 — create the review
    const review = new Review({
      body,
      rating,
      novel: novel._id,       // reference to the novel
      author: req.user._id    // reference to logged in user
    });

    // Step 2 — save review to DB
    await review.save();

    // Step 3 — push review ID into novel's reviews array
    novel.reviews.push(review._id);
    await novel.save();

    res.redirect(`/novels/${novel._id}`);
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// GET /novels/:id/reviews/:reviewId/edit — show edit form
router.get('/novels/:id/reviews/:reviewId/edit', isLoggedIn, async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id);
    if (!novel) {
      return res.send('Novel not found');
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.send('Review not found');
    }

    // ownership check — is this your review?
    if (!review.author.equals(req.user._id)) {
      return res.redirect(`/novels/${novel._id}`);
    }

    res.json(review);   // temporary — will pass to view later
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// PUT /novels/:id/reviews/:reviewId — update review
router.put('/novels/:id/reviews/:reviewId', isLoggedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.send('Review not found');
    }

    // ownership check
    if (!review.author.equals(req.user._id)) {
      return res.redirect(`/novels/${req.params.id}`);
    }

    const { body, rating } = req.body;

    await Review.findByIdAndUpdate(
      req.params.reviewId,
      { body, rating },
      { new: true, runValidators: true }
    );

    res.redirect(`/novels/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

// DELETE /novels/:id/reviews/:reviewId — delete review
router.delete('/novels/:id/reviews/:reviewId', isLoggedIn, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.send('Review not found');
    }

    // ownership check
    if (!review.author.equals(req.user._id)) {
      return res.redirect(`/novels/${req.params.id}`);
    }

    // Step 1 — remove review ID from novel's reviews array
    await Novel.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId }
    });

    // Step 2 — delete the review itself
    await Review.findByIdAndDelete(req.params.reviewId);

    res.redirect(`/novels/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.send('Something went wrong');
  }
});

module.exports = router;