const Post = require("../models/post");
const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destionation: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if (isValid) {
            error = null;
        }
        callback(error, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("", multer(storage).single("image"), (req, res, next) => {
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
