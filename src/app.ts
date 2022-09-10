import type { Express, CookieOptions } from "express";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { client } from "config";
import { isAuthenticated } from "middleware";
import { generateSession, destroySession } from "lib/session";

import { users } from "data";

const app: Express = express();

const port = 3220;

(async () => {
  await client.connect();
})();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

const cookieOpts: CookieOptions = {
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: false, // change to true in production
  sameSite: "lax",
};

app.get("/", async (req, res) => {
  res.send("Redis Session Example");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // query & validate user with your own logic and conditions
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }
  // generate the session and return the cookie
  const signedCookie = await generateSession({
    userId: user.id,
    cookie: cookieOpts,
  });
  return res.cookie("sid", signedCookie, cookieOpts).json({ signedCookie });
});

app.post("/logout", isAuthenticated, async (req, res) => {
  const sid = req.sid;

  if (!sid) {
    return res.status(401).send("Not authenticated");
  }
  // get remove options and remove cookie
  await destroySession(sid);
  return res.clearCookie("sid").send("Logged out");
});

app.get("/protected", isAuthenticated, async (req, res) => {
  // protected route, has to pass all middleware (isAuthenticated) checks
  // req.locals.user is the user object set in isAuthenticated if the user is authenticated
  const { user } = req.locals;
  return res.json({ user });
});

app.listen(port, () => {
  console.log(`\nApp listening on port ${port}`);
});
