const {User} = require('../models/user');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20')

router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})


router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})



router.post('/', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),   //here the 10 is in the place of salting it is done for giving extra security to the password  
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.post('/login', async (req,res) => {

    const userP = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!userP) {
        return res.status(400).send('The user not found');
    }

    if(userP && bcrypt.compareSync(req.body.password, userP.passwordHash)) {
        const token = jwt.sign(    // jwt.sign() demands for an object the second parameter is 
            {
                userId: userP.id,
                isAdmin: userP.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).send({user: userP.email , token: token}) 
    } else {
       res.status(400).send('password is wrong!');
    }

    
})




router.post('/register', async (req,res)=>{
    const userP = await User.findOne({email: req.body.email})
    if(userP){
        res.send(userP)
    }
    else{
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })
        user = await user.save();
    
        if(!user)
        return res.status(400).send('the user cannot be created!')
    
        res.send(user);
    }
    
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments((count) => count)

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})




// google


passport.use(
    new GoogleStrategy({
        clientID:"388214865982-4kibuqqjd5fbjsog6idptf56gdsa96h9.apps.googleusercontent.com",
        clientSecret:"ZSYJw86h7bZue_t0cIW7THZB",
        callbackURL: "/api/v1/users/google/callback"
    },
    (accessToken,refreshToken,profile,done)=>{
        console.log("access token",accessToken);
        console.log("refresh token",refreshToken);
        console.log("profile",profile);
        console.log("done",done);
    }
    )
)

router.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/google/callback',passport.authenticate('google'))



module.exports =router;