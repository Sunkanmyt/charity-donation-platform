// TEMPORARY: delete this file once the real auth is merged
module.exports = (req, res, next) => {
  req.user = { _id: "64b7f0c2a1b2c3d4e5f60718", role: "donor" };
  next();
};