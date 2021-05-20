const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campground')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({ storage });

const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const {campgroundSchema} = require('../schemas')

router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn,upload.array('image'), validateCampground, catchAsync(campground.createCampground))
    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body,req.files);
    //     res.send('IT WORKED!!')
    // })


router.get('/new',isLoggedIn,campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,isAuthor, upload.array('image'),validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campground.deleteCampground))


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))

module.exports = router;