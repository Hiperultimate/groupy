import bcrypt from "bcrypt";

export const hashPassword = (plainPassword: string): string => {
  const saltRounds = 5;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(plainPassword, salt);
  return hashedPassword;
};

export const comparePassword = (
  hashedPassword: string,
  plainPassword: string
): boolean => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
