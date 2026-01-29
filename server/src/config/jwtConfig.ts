

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your_jwt_secret",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
  expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as string,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as string,
};