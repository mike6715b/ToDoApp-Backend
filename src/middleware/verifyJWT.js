import jwt from "jsonwebtoken";

const { verify } = jwt;

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    let jwtPayload;
    try {
      jwtPayload = verify(token, process.env.JWT_SECRET);
      res.locals.jwtPayload = jwtPayload;
      next();
    } catch (error) {
      console.log(`Ivalid JWT token: ${error}`);
      res.status(403).json({
        error: "Forbidden",
      });
    }
  } else {
    res.status(403).json({
      error: "Forbidden",
    });
  }
};
