const path = require('path');
const mongodb = require('mongodb');
const express = require("express");
const db = require('./data/database');
const bodyParser = require ("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app  = express();
const ObjectId = mongodb.ObjectId;

mongoose.connect(process.env.mongodblink, {useNewUrlParser: true});
//mongoose.connect("mongodb://localhost:27017/agrihelper", {useNewUrlParser: true});


// Database structure for user details
const userSchema = {
    name: String,
    email: String,
    password: String
};
const User = new mongoose.model("User", userSchema);
// Database structure for user details

var result="non";

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home", {css : "style.css"});
});
app.get("/fertilizer", function(req, res){
    res.render("fertilizer",{css : "fertilizer.css"});
});
app.get("/health", function(req, res){
    res.render("health",{css : "health.css"});
});
app.get("/query", function(req, res){
    res.render("query",{css : "query.css"});
});
app.get("/crop", function(req, res){
    res.render("crop",{css : "crop.css"});
});
app.get("/shops", function(req, res){
    res.render("shops",{css : "shops.css"});
});
app.get("/elearning", function(req, res){
    res.render("elearning",{css : "elearning.css"});
});
app.get("/elearning2", function(req, res){
    res.render("elearning2",{css : "elearning2.css"});
});
app.get("/elearning3", function(req, res){
    res.render("elearning3",{css : "elearning3.css"});
});
app.get("/elearning4", function(req, res){
    res.render("elearning4",{css : "elearning4.css"});
});
app.get("/elearning5", function(req, res){
    res.render("elearning5",{css : "elearning5.css"});
});
app.get("/login", function(req, res){
    res.render("login",{result:"result"});
});
app.get("/signup", function(req, res){
    res.render("signup");
});

app.post("/signup",function(req, res){
    if(req.body.password === req.body.cpassword && req.body.tc=="true"){
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);
        } else{
            res.render("login",{result:"non"});
        }
    })}
});


app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            result = "uerr";
        } else{
            if(foundUser){
                if(foundUser.password == password){
                    res.redirect("/posts");
                }
                else{
                    result = "perr";
                    res.redirect("/login");
                }
            }
        }
    });
});

// server for query page
app.get('/posts', async function (req, res) {
    const posts = await db
      .getDb()
      .collection('posts')
      .find({})
      .project({ name: 1, question: 1, date: 1 })
      .toArray();
    res.render('posts-list', { posts: posts });
  });
  app.get('/new-post', async function (req, res) {
    const authors = await db.getDb().collection('authors').find().toArray();
    res.render('create-post', { authors: authors });
  });
  app.post('/posts', async function (req, res) {
    const authorId = new ObjectId(req.body.author);
    const author = await db
      .getDb()
      .collection('authors')
      .findOne({ _id: authorId });
  
    const newPost = {
      name: req.body.name,
      question: req.body.question,
      date: new Date()
    };
    const result = await db.getDb().collection('posts').insertOne(newPost);
    console.log(result);
    res.redirect('/posts');
  });
  app.get('/posts/:id', async function (req, res) {
    const postId = req.params.id;
    const post = await db
      .getDb()
      .collection('posts')
      .findOne({ _id: new ObjectId(postId) }, { summary: 0 });
  
    if (!post) {
      return res.status(404).render('404');
    }
  
    post.humanReadableDate = post.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    post.date = post.date.toISOString();
  
    res.render('post-detail', { post: post, comments: null });
  });

  app.get('/posts/:id/comments', async function (req, res) {
    const postId = new ObjectId(req.params.id);
    const post = await db.getDb().collection('posts').findOne({ _id: postId });
    post.humanReadableDate = post.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    post.date = post.date.toISOString();
    const comments = await db
      .getDb()
      .collection('comments')
      .find({ postId: postId }).toArray();
  
    return res.render('post-detail', { post: post, comments: comments });
  });

  app.post('/posts/:id/comments', async function (req, res) {
    const postId = new ObjectId(req.params.id);
    const newComment = {
      postId: postId,
      name: req.body.name,
      comment: req.body.comment,
    };
    await db.getDb().collection('comments').insertOne(newComment);
    res.redirect('/posts/' + req.params.id);
  });
  
// server for query page

db.connectToDatabase().then(function () {
    app.listen(3000, function(){
        console.log("Server started at port 3000.");
    });
});