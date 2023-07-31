import validator from "validator";

// email 유효성 검사
function isValidEmail(email) {
  return validator.isEmail(email);
}

// 비밀번호 유효성 검사
function isValidPassword(password) {
  return password.length >= 8;
}

export { isValidEmail, isValidPassword };
