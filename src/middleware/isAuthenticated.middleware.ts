import type { Request, Response, NextFunction } from "express";
import cookie from "cookie-signature";
import { users } from "data";
import { getSession } from "lib/session";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get cookie from request
  const signedCookie: string = req.cookies?.sid ?? "";

  // set default request values for session
  req.locals = { user: null };
  req.isAuthenticated = false;
  req.sid = null;

  if (signedCookie) {
    // unsign cookie to get just the sid
    const sid = cookie.unsign(signedCookie, "SUPER_SECRET");

    if (!sid) {
      // if the cookie is not signed, secret is wrong, or the cookie is expired
      return res.status(401).send("Not authenticated - no cookie");
    }

    // fetch session with sid
    const session = await getSession(sid);

    if (!session) {
      return res.status(401).send("Not authenticated - session not found");
    }

    const { userId } = session;

    // query user and set user in locals to be used in next route (/protected)
    const user = users.find((user) => user.id === userId);
    if (user) {
      req.isAuthenticated = true;
      req.sid = sid;
      req.locals.user = user;
      return next();
    }
  }
  return res.status(401).send("Not authenticated");
};
