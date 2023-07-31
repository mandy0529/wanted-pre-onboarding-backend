import {
  isValidEmail,
  isValidPassword,
  hashBcryptPassword,
} from "../lib/index.js";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError } from "../errors/index.js";
import prismaDB from "../db/db.js";
import { HttpStatusCode } from "axios";

// register user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // uuid 생성
  const uuid = uuidv4();

  // 피드가 하나라도 충족되지 않을 때
  if (!email || !password) {
    throw new BadRequestError("Please provide an email and password");
  }

  // 이메일 유효성 검사
  if (!isValidEmail(email)) {
    throw new BadRequestError("Please provide a valid email");
  }

  // password 유효성 검사
  if (!isValidPassword(password)) {
    throw new BadRequestError("Password must be at least 8 characters long");
  }

  // 이메일 중복 확인
  const isExistUser = await prismaDB.user.findUnique({
    where: {
      email,
    },
  });

  // 이메일이 중복 된다면 에러
  if (isExistUser) {
    throw new BadRequestError("User already exists");
  }

  // body에서 받아온 비밀번호 hash하기
  const hashPassword = await hashBcryptPassword(password);

  // 새 유저 가입
  await prismaDB.user.create({
    data: {
      id: uuid,
      email,
      password: hashPassword,
    },
  });

  // return user
  return res
    .status(HttpStatusCode.Created)
    .json({ msg: "register user successfully" });
};

// login user
export const loginUser = async (req, res) => {
  return res.json({ msg: "login user" });
};
