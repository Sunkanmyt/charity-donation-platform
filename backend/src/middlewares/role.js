const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : "unauthenticated"}' is not authorized to perform this action.`,
        data: null,
      });
    }
    next();
  };
};

module.exports = authorize;
