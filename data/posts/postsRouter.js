const express = require('express')
const router = express.Router()
const data = require('../db');


router.get("/api/posts", (req, res) => {
    data.find()
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(500).json({
          errorMessage: "The posts information could not be retrieved.",
        });
      }
    });
  });
  router.get("/:id/comments", (req, res) => {
    const id = req.params.id;
    data.findById(id).then((post) => {
      // If the post with the specified id is not found:
      if (post.length === 0) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
      } else {
        data.findPostComments(id)
        .then((post) => {
          if (post.length > 0) {
            res.status(200).json(post);
            // If there's an error in retrieving the comments from the database:
          } else {
            res.status(500).json({
              errorMessage: "The comments information could not be retrieved",
            });
          }
        });
      }
    });
  });
  // 	Returns the post object with the specified id.
router.get("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    data.findById(id).then((post) => {
      if (post.length === 1) {
        res.status(200).json(post);
        // If the post with the specified id is not found:
      } else if (post.length === 0) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist.",
        });
        // If there's an error in retrieving the post from the database:
      } else {
        res.status(500).json({
          errorMessage: "The posts information could not be retrieved",
        });
      }
    });
  });
    // Creates a post using the information sent inside the request body.
router.post("/api/posts/comments/id", (req, res) => {
    //If the request body is missing the title or contents property:
    if (!req.body.title || !req.body.contents) {
      return res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
      // If the information about the post is valid:
    } else if (req.body.title && req.body.contents) {
      const title = req.body.title;
      const contents = req.body.contents;
      const newPost = {
        title,
        contents,
      };
      data.insert(newPost).then((id) => {
        data.find().then((post) => {
          const match = post.find((x) => x.id === id.id);
          // If there's an error while saving the post:
          if (match) {
            return res.status(201).json(newPost);
          } else {
            return res.status(500).json({
              errorMessage:
                "There was an error while saving the post to the database",
            });
          }
        });
      });
    }
  });

  
  // Creates a comment for the post with the specified id using information sent inside of the request body.
router.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    // If the request body is missing the text property:
    if (!req.body.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment" });
      // If the information about the comment is valid:
    } else if (req.body.text) {
      data.findById(id).then((post) => {
        // If the post with the specified id is not found:
        if (post.length === 0) {
          res.status(404).json({
            errorMessage: "The post with the specified ID does not exist.",
          });
          // If the information about the comment is valid:
        } else if (post.length === 1) {
          data
            .insertComment(comment)
            .then((commentId) => {
              data.findPostComments(id).then((post) => {
                if (post.length > 0) {
                  res.status(201).json(comment);
                  // If there's an error while saving the comment:
                } else {
                  res.status(500).json({
                    errorMessage:
                      "There was an error while saving the comment to the database.",
                  });
                }
              });
            })
            .catch((err) => console.log(err));
        }
      });
    }
  });
  
  // Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
  router.put("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    const newPost = req.body;
    // If the request body is missing the title or contents property:
    if (!req.body.title || !req.body.contents) {
      res
        .status(400)
        .json({ errorMessage: "Please provide title and contents for the post" });
    } else {
      // If the post with the specified id is not found:
      data.findById(id).then((post) => {
        if (post.length === 0) {
          res.status(404).json({
            errorMessage: "The post with the specified ID does not exist",
          });
        } else {
          data.update(id, newPost).then((posted) => {
            if (posted === 1) {
              res.status(200).json(post);
            } else {
              res.status(500).json({
                errorMessage: "The post information could not be modified.",
              });
            }
          });
        }
      });
    }
  });
  
  // 	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
  router.delete("/:id", (req, res) => {
    const id = req.params.id;
    const deletedPost = {};
    // If the post with the specified id is not found:
    data.findById(id).then((post) => {
      if (post.length === 0) {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist",
        });
      } else if (post.length > 0) {
        data.remove(id).then((removed) => {
          if (removed === 1) {
            data.find().then((posts) => {
              if (post) {
                res.status(200).json(post);
                // If there's an error in retrieving the posts from the database:
              }
            });
          } else {
            res
              .status(500)
              .json({ errorMessage: "The post could not be removed" });
          }
        });
      }
    });
  });