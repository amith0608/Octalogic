import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  const tokenParts = token.split(" ");
  if (!token) {
    return res.sendStatus(401);
  }
  if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
    jwt.verify(tokenParts[1], process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      //user details are attached here
      req.user = user;
      next();
    });
  }
}
