import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const bearerHeader = req?.headers?.authorization;
    let token = req.cookies?.accessToken;

    if (!token && bearerHeader && bearerHeader.startsWith("Bearer ")) {
      token = bearerHeader.split(" ")[1];
    }

    // Token not found
    if (!token) {
      return res.status(401).send({
        status: false,
        message: "No token provided",
        error: true,
        success: false,
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: false,
          message: "Invalid or expired token",
          error: true,
          success: false,
        });
      }

      // Set userId to request
      req.userId = decoded.id;
      next();
    });

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export default auth;
