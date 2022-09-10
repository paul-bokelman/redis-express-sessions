import type { CookieOptions } from "express";
import cookieSigner from "cookie-signature";
import { nanoid } from "nanoid";
import { client } from "config";

type GenerateSession = ({
  userId,
  cookie,
}: {
  userId: number;
  cookie: CookieOptions;
}) => Promise<string>;

export const generateSession: GenerateSession = async ({ userId, cookie }) => {
  // generate the session id (identifier used to retrieve the session from redis)
  const sid = nanoid();
  try {
    // set the session with the sid as the key with the userId and cookie as value
    await client.set(sid, JSON.stringify({ userId, cookie }));
    // sign the sid with the secret and return the signedCookie to be set
    const signedCookie = cookieSigner.sign(sid, "SUPER_SECRET");
    return signedCookie;
  } catch (error) {
    throw new Error("Failed to generate session");
  }
};
