import bcrypt from 'bcryptjs';

export const encryptPasswords = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const checkPasswords = async (password, savedPassword) => {
    const comparado = await bcrypt.compare(password, savedPassword);
    return comparado;
};

