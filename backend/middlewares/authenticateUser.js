// middleware/authenticateUser.js
const authenticateUser = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    next();  // Proceed to the route handler
  };
  
  module.exports = authenticateUser;
  