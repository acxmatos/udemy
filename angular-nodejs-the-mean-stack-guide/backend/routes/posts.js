const Post = require("../models/post");
const express = require("express");

const router = express.Router();

router.post("", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });
    post.save().then((createdPost) => {
        console.log("Post Created");
        console.log(createdPost);
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id,
        });
    });
});

router.patch("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log("To be updated");
    console.log(post);
    Post.updateOne({
        _id: req.params.id
    }, post)
        .then((result) => {
            console.log("Post Updated");
            console.log(result);
            res.status(200).json({
                message: "Update successful!",
            });
        });
});

router.get("", (req, res, next) => {
    Post.find().then((documents) => {
        console.log("Posts Fetched");
        console.log(documents);
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: documents,
        });
    });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            console.log("Post Fetched");
            console.log(post);
            res.status(200).json(post);
        } else {
            console.log("PostId = " + req.params.id + " not found");
            res.status(404).json({
                message: "Post not found!"
            });
        }
    })
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({
        _id: req.params.id,
    }).then((result) => {
        console.log("Post Deleted");
        console.log(result);
        res.status(200).json({
            message: "Post deleted!",
        });
    });
});

module.exports = router;
