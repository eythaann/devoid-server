const helper = {};
const bcrypt = require('bcryptjs');

helper.encryptPasswords = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helper.checkPasswords = async (password, savedPassword) => {
    const comparado = await bcrypt.compare(password, savedPassword);
    return comparado;
};

module.exports = helper;
