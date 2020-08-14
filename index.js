const express = require("express");
const postsRouter = require("./data/posts/posts-router");
const welcomeRouter = require("./data/host/welcome")
const server = express();
const port = 8000;


server.use(express.json());
server.use(welcomeRouter);
server.use(postsRouter);
 
 

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/api/posts`)
})