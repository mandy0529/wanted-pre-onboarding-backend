import bcrypt from "bcrypt";

//  bcrypt password hash
const hashBcryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hashSync(password, salt);
};

// compare original password and written password
const comparePasswordWithBcrypt = async (writtenPassword, originalpassword) => {
  return await bcrypt.compareSync(writtenPassword, originalpassword);
};

export { hashBcryptPassword, comparePasswordWithBcrypt };
