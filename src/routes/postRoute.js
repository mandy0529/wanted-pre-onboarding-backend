import express from "express";
import {
  createPost,
  deleteSinglePost,
  editSinglePost,
  getAllPost,
  getSinglePost,
} from "../controllers/postController.js";

const router = express.Router();

// register & login
router.route("/").post(createPost).get(getAllPost);
router
  .route("/:id")
  .get(getSinglePost)
  .put(editSinglePost)
  .delete(deleteSinglePost);

export default router;
