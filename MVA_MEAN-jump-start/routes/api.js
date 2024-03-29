const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Post = mongoose.model('Post');

const isAuthenticated = function(req, res, next) {
  if (req.method === "GET") {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect("/#login");
};

router.use("/posts", isAuthenticated);

//api for all posts
router
  .route("/posts")
  //create a new post
  .post(function(req, res) {
    let post = new Post();
    post.text = req.body.text;
    post.created_by = req.body.created_by;
    post.save(function(err, post) {
      if (err) return res.send(500, err);

      return res.json(post);
    });
  })
  .get(function(req, res) {
    Post.find(function(err, posts) {
      if(err) return res.send(500, err);

      return res.send(200, posts);
    })
  });

//api for a specfic post
router
  .route("/posts/:id")
  .put(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if(err) res.send(err);

      post.created_by = req.body.created_by;
      post.text = req.body.text;

      post.save(function(err, post) {
        if(err) res.send(err);

        res.json(post);
      });
    });
  })
  .get(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if(err) res.send(err);

      res.json(post);
    })
  })
  .delete(function(req, res) {
    Post.remove({ _id: req.params.id }, function(err) {
      if(err) res.send(err);

      res.json("deleted :(");
    });
  });

module.exports = router;
