import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";
import * as authData from "../data/authData";
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
} from "../utils/makeError";

export async function registerUser(
  email: string,
  password: string,
  name?: string,
) {
  const existingUser = await authData.findUserByEmail(email);

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData: { email: string; password: string; name?: string } = {
    email,
    password: hashedPassword,
  };

  if (name !== undefined) {
    userData.name = name;
  }

  const user = await authData.createUser(userData);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
  });

  await authData.addRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    tokens,
  };
}

export async function loginUser(email: string, password: string) {
  const user = await authData.findUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
  });

  await authData.addRefreshToken(user.id, tokens.refreshToken);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    tokens,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  const user = await authData.findUserById(decoded.userId);

  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
  });

  await authData.replaceRefreshToken(
    user.id,
    refreshToken,
    tokens.refreshToken,
  );

  return { tokens };
}

export async function logoutUser(refreshToken: string) {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const user = await authData.findUserById(decoded.userId);

  if (user) {
    await authData.removeRefreshToken(user.id, refreshToken);
  }

  return { message: "Logout successful" };
}

export async function getUserProfile(userId: string) {
  const user = await authData.findUserById(userId);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
