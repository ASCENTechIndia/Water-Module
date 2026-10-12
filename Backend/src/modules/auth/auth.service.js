const { loginWithStoredProcedure } = require('./auth.repo');

async function loginUser(userId, password, extra = {}) {
  return loginWithStoredProcedure(userId, password, extra);
}

module.exports = {
  loginUser,
};
