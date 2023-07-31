import primsaDB from "../db/db.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/index.js";
import { isTokenValid } from "../lib/index.js";

// 로그인한 사용자 token받아서 req.user에 등록
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const payload = isTokenValid(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthenticatedError(
      "Authentication Invalid. please login again"
    );
  }
};

// 게시글 작성자 확인하는 authorization 권한 구현
const authorizePermissionForOnlyAuthor = async (req, res, next) => {
  // 해당 게시글 Id 얻기
  const { id } = req.params;

  // id가 number type이 아닌 모든 경우 throw error
  if (!Number(id)) {
    throw new BadRequestError("Please provide a valid id");
  }

  // 내 post db에서 author email 찾기
  const existPost = await primsaDB.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      author: {
        select: {
          email: true,
        },
      },
    },
  });

  // 해당 post가 존재하지 않을 때
  if (!existPost) {
    throw new NotFoundError("Post does not exist");
  }

  // authenticateUser에서 받아온 email과 내 db의 유저 email이 서로 맞지 않을때 throw error
  if (existPost?.author?.email !== req?.user?.email) {
    throw new UnauthorizedError("Not Authorized to access this user");
  }
  next();
};

export { authenticateUser, authorizePermissionForOnlyAuthor };
