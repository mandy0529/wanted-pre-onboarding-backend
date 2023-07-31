import express from "express";
import {
  createPost,
  deleteSinglePost,
  editSinglePost,
  getAllPost,
  getSinglePost,
} from "../controllers/postController.js";
import {
  authenticateUser,
  authorizePermissionForOnlyAuthor,
} from "../middlewares/index.js";

const router = express.Router();

// register & login
router.route("/").post(authenticateUser, createPost).get(getAllPost);
router
  .route("/:id")
  .get(getSinglePost)
  .put(authenticateUser, authorizePermissionForOnlyAuthor, editSinglePost)
  .delete(authenticateUser, authorizePermissionForOnlyAuthor, deleteSinglePost);

export default router;
