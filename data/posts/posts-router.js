const express = require("express");
const router = express.Router();
const db = require('../db');

router.post("/api/posts", (req, res) => {
    db.insert(req.body)
    .then(posts => {
        if (posts) {
            res.status(201).json(posts);
        } else {
            res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: "There was an error while saving the post to the database"
        });
    });
});

// Creates a comment for the post with the specified id using information sent 
// inside of the `request body


router.post('/api/posts/:id/comments', (req, res) => {
    db.insertComment(req.params.id)
    .then(post => {
        if (post) {
            res.status(201).json(post);
        } else if (!req.body.id) {
            res.status(400).json({ 
                message: "The post with the specified ID does not exist." 
            });
            } else {
             res.status(404).json({ 
                message: "The post with the specified ID does not exist."
            });
        }
    })
          .catch(error => {
            console.log(error);
            res.status(500).json({
              error: "There was an error while saving the comment to the database"
            });
          });
      });

      // Returns an array of all the post objects contained in the database
      router.get('/api/posts', (req, res) => {
        db.find(req.params)
    .then((posts) => {
        res.status(200).json(posts)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({
            message: "Error retrieving posts"
        })
    })
   
})

// Returns the post object with the specified id

router.get('/:id', (req, res) => {
    db.findById(req.params.id)
      .then(({post}) => {
        { post 
            ?res.status(200).json(post) 
            :res.status(404).json({ 
                message: 'Post not found ' 
            })}
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ 
            errorMessage: 'Error getting post by ID'
        });
      })
  });

  // Returns an array of all the comment objects associated with the post with 
// the specified id

router.get('/api/posts/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findPostComments(id)
      .then(post => {
        if(post.length === 0) {
          res.status(404).json({ message: 'Post not found' });
        } else {
          res.status(200).json(post)
        }
      })
      .catch(error => {
        res.status(500).json({ errorMessage: 'Server error, could not get comments', error })
      })
  })

  // Removes the post with the specified id and returns the **deleted post 
 // object**. You may need to make additional calls to the database in order 
 // to satisfy this requirement.

 router.delete('/api/posts/:id', (req, res) => {
    db.remove(req.params.id)
      .then(count => {
        if(count > 0) {
          res.status(200).json({ message: 'Post deleted!' })
        } else {
          res.status(404).json({ message: 'Post could not be located.' })
        }
      })
      .catch(error => {
        res.status(500).json({ message: '** Server error removing the post **', error })
      })
  });

   // Updates the post with the specified `id` using data from the `request body`. 
 // Returns the modified document, NOT THE ORIGNAL!

 router.put('/api/posts/:id', (req, res) => {
    const changes = req.body;
    db.update(req.params.id, changes)
      .then(post => {
        { post ? res.status(200).json(post) : res.status(404).json({ message: 'Post could not be found' })}
      })
      .catch(error => {
        res.status(500).json({ errorMessage: '** Server error updating the post **', error });
      })
  });

module.exports = router