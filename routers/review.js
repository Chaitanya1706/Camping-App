const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Campground = require('../models/campground')
const review = require('../controllers/reviews')

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')



router.post('/', isLoggedIn,validateReview, catchAsync(review.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports = router;