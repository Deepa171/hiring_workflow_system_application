const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    const queryToken = req.query.token;

    if (!authHeader && !queryToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = queryToken || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
