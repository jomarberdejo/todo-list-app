import prisma from "../config/db";

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  return await prisma.user.create({
    data,
  });
}

export async function addRefreshToken(userId: string, refreshToken: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokens: {
        push: refreshToken,
      },
    },
  });
}

export async function replaceRefreshToken(
  userId: string,
  oldToken: string,
  newToken: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  return await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokens: {
        set: user.refreshTokens
          .filter((token: string) => token !== oldToken)
          .concat(newToken),
      },
    },
  });
}

export async function removeRefreshToken(userId: string, refreshToken: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  return await prisma.user.update({
    where: { id: userId },
    data: {
      refreshTokens: {
        set: user.refreshTokens.filter((token: string) => token !== refreshToken),
      },
    },
  });
}