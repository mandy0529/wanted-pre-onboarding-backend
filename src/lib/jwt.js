import jwt from "jsonwebtoken";
// ----------------------------------------------

//  1. create JWT
const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

//  2. is token valid check
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

export { createJWT, isTokenValid };
