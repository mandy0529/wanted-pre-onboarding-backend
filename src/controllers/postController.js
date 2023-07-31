import { HttpStatusCode } from "axios";
import primsaDB from "../db/db.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// create post -----------------------------------------------
export const createPost = async (req, res) => {
  const { title, content } = req.body;

  // field 하나라도 충족 되지 않을 때
  if (!title || !content) {
    throw new BadRequestError("Please provide a title and content");
  }

  // 새로운 post 생성
  await primsaDB.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          email: req.user.email,
        },
      },
    },
  });

  // return result
  return res
    .status(HttpStatusCode.Created)
    .json({ msg: "create post successfully" });
};

// get all post ----------------------------------------------
export const getAllPost = async (req, res) => {
  const postsPerPage = 10;
  const currentPage = req.query.page ? parseInt(req.query.page) : 1;

  const startIndex = (currentPage - 1) * postsPerPage;

  // postsPerPage에 맞게 해당 페이지의 데이터를 추출 (author email 포함)
  const posts = await primsaDB.post.findMany({
    skip: startIndex,
    take: postsPerPage,
    select: {
      title: true,
      content: true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  // return posts and page
  return res.status(HttpStatusCode.Ok).json({ posts, page: currentPage });
};

// get single post -------------------------------------------
export const getSinglePost = async (req, res) => {
  const { id } = req.params;

  // id가 number type이 아닌 모든 경우 throw error
  if (!Number(id)) {
    throw new BadRequestError("Please provide a valid id");
  }

  // req.params로 들어온 post 찾기 (author email 포함)
  const post = await primsaDB.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      title: true,
      content: true,
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  // post이 없다면 throw error
  if (!post) {
    throw new NotFoundError("Post does not exist");
  }

  // return post
  return res.status(HttpStatusCode.Ok).json({ post });
};

// edit single post -------------------------------------------
export const editSinglePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  //  fields중 하나라도 충족이 되지 않을때
  if (!title || !content) {
    throw new BadRequestError("please provide all values");
  }

  // 내 db에서 post edit
  await primsaDB.post.update({
    where: {
      id: Number(id),
    },
    data: {
      title,
      content,
    },
  });

  // return result
  return res
    .status(HttpStatusCode.Ok)
    .json({ msg: "edit single post successfully" });
};

// delete single post
export const deleteSinglePost = async (req, res) => {
  const { id } = req.params;

  // delete post
  await primsaDB.post.delete({
    where: {
      id: Number(id),
    },
  });

  // return result
  return res
    .status(HttpStatusCode.NoContent)
    .json({ msg: "delete single post successfully" });
};
