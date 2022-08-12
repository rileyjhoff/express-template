const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const isSecure = process.env.SECURE_COOKIES === 'true';
const COOKIE_NAME = process.env.COOKIE_NAME;
const cookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'strict',
  maxAge: ONE_DAY_IN_MS,
};

function sign(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    // expiresIn: '30d',
  });
}

function verify(cookie) {
  return jwt.verify(cookie, process.env.JWT_SECRET);
}

function verifyToken(req) {
  const cookie = req.cookies[COOKIE_NAME];

  if (!cookie) throw new Error('You must be signed in to continue');

  return verify(cookie);
}

function setToken(res, payload) {
  const token = sign(payload);
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearToken(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
}

module.exports = {
  verifyToken,
  setToken,
  clearToken,
};
