const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Catch = require('../models/catch');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');
require('dotenv').config();

//GET ALL USERS
router.get('/', (req, res) => {
    User.find({})
    .then((data) => {res.json(data)})
    .catch((error) => {console.log('Error: ' + error)});
});

//REGISTER
router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json('Email already exists');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.email, 
        password: hashedPassword
    });
    try{
        await user.save();
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    } catch(err){
        res.status(400).send(err);
    }   
});

//LOGIN
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exist');
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

//GET SELECTED CATCH
router.get('/catch/:fishId', (req, res) => {
    Catch.findOne({_id: req.params.fishId})
    .then((fish) => {
        console.log(fish);
        res.json(fish);
    })
    .catch(err => res.send(err));        
})

//GET ALL CATCHES
router.get('/allcatches', (req, res) => {
    Catch.find({})
    .then((catches) => {
        console.log(catches);
        res.json(catches);
    })
    .catch(err => res.send(err));        
})

//GET ALL LOGGED IN USER CATCHES
router.get('/usercatches', verifyToken, (req, res) => {
    const tokenId = jwt.verify(req.token,  process.env.TOKEN_SECRET);
    Catch.find({creatorId: tokenId})
    .then((catches) => {
        console.log(catches);
        res.json(catches); 
    })
    .catch(err => res.send(err));        
})

//GET LOGGED IN USER
router.get('/getuser', verifyToken, (req, res) => {
    const tokenId = jwt.verify(req.token,  process.env.TOKEN_SECRET);
    console.log("User ID: " + JSON.stringify(tokenId));
    User.findOne({_id: tokenId})
    .then(user => {
        console.log(user);
        res.send(user);
    })
    .catch((err) => res.send(err))
})

//UPDATE USER PROFILE
router.put('/editprofile', verifyToken, (req, res) => {
    const tokenId = jwt.verify(req.token,  process.env.TOKEN_SECRET);
    User.updateOne({_id: tokenId}, {$set: 
        {
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email
        }
    })
    .then(() => {
        console.log("Updated profile")
    })
    .catch((err) => res.send(err))
});

//LOG NEW CATCH
router.post('/catch', verifyToken, async (req, res) => {
    const tokenId = await jwt.verify(req.token,  process.env.TOKEN_SECRET);
    const loggedUser = await User.findOne({_id: tokenId});
    const userFirstName = loggedUser.firstname;
    const newCatch = new Catch({
        species: req.body.species,
        water: req.body.water,
        bait: req.body.bait,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        creatorId: tokenId,
        creatorName: userFirstName
    })
    try{
        await newCatch.save();
        res.json(newCatch);
    } catch(err){
        res.status(400).send(err);
    }   
})

//DELETE CATCH
router.delete('/deletecatch/:catchId', verifyToken, (req, res) => {
    const tokenId = jwt.verify(req.token,  process.env.TOKEN_SECRET);
    Catch.deleteOne({_id: req.params.catchId})
    .then(() => {
        User.updateOne({_id: tokenId}, {$pull: {catchList: req.params.catchId}})
        .then(() => {
            Catch.find({creatorId: tokenId})
            .then((fishes) => {
                res.json(fishes);
            })
            .catch(err => res.send(err)); 
        })
        .catch(err => res.send(err));  
    })
    .catch((err) => res.send(err));
})



function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;