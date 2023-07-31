import { StatusCodes } from "http-status-codes";
// -------------------------------------------------------

const errorHandlerMiddleware = (err, req, res, next) => {
  // set default
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  // validation error
  // 어떤 required 요소가 불충족되어 있을 때
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  // duplicate error
  // 같은 아이디 register 할 때
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  // cast error
  // 코드 오류이거나 type 에러
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  // 이 모든 에러가 없을떄 res.json 요청
  console.log(customError.msg, "❌ custom error msg");
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
