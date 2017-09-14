const express = require("express");
const router = express.Router();

const isAuthenticated = (req, res, next) => {
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
  .post((req, res) => {
    //TODO create a new post in the database
    res.send({ message: "TODO create a new post in the database" });
  })
  .get((req, res) => {
    //TODO get all the posts in the database
    res.send({ message: "TODO get all the posts in the database" });
  });

//api for a specfic post
router
  .route("/posts/:id")
  //create
  .put((req, res) => {
    return res.send({
      message: "TODO modify an existing post by using param " + req.params.id
    });
  })
  .get((req, res) => {
    return res.send({
      message: "TODO get an existing post by using param " + req.params.id
    });
  })
  .delete((req, res) => {
    return res.send({
      message: "TODO delete an existing post by using param " + req.params.id
    });
  });

module.exports = router;
