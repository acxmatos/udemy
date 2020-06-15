const express = require("express");

const PostsController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractImage = require("../middleware/image");

const router = express.Router();

router.get("", PostsController.getAll);
router.get("/:id", PostsController.getById);
router.post("", checkAuth, extractImage, PostsController.create);
router.patch("/:id", checkAuth, extractImage, PostsController.update);
router.delete("/:id", checkAuth, PostsController.delete);

module.exports = router;
