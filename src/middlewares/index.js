import notFoundMiddleware from "./not-found.js";
import errorHandlerMiddleware from "./error-handler.js";
import { authenticateUser, authorizePermissionForOnlyAuthor } from "./auth.js";

export {
  notFoundMiddleware,
  errorHandlerMiddleware,
  authenticateUser,
  authorizePermissionForOnlyAuthor,
};
