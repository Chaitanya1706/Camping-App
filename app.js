if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const joi = require('joi');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routers/users')
const campgroundRoutes = require('./routers/campground');
const reviewRoutes = require('./routers/review');

const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const session = require('express-session')
const MongoStore = require("connect-mongo");
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
 
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error:"));
db.once("open",()=>{
    console.log("Database Connected!!");
})


app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize())

// const store = MongoStore.create({
//     url: dbUrl,
//     secret: 'thisshouldbeabettersecret!',
//     touchAfter: 24*3600
// })

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR",e)
// })

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig = {
    secret,
        store: MongoStore.create({ 
            mongoUrl: dbUrl ,
                touchAfter:24*3600,
                secret,

        }),
        name: 'session',
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            // secure: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    

    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    
    "https://use.fontawesome.com",
    
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css",
    
    


];
const connectSrcUrls = [
    "https://fonts.gstatic.com",
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [
   
    

];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/chats/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({email: 'chats@gmail.com', username: 'chats'});
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/',(req,res)=>{
    res.render('campgrounds/home');
})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {status=500} = err;
    if(!err.message) err.message = 'OHH!!..Something Went Wrong!'
    res.status(status).render('error',{err});
})


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Listening at port ${port} `);
})