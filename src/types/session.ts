export interface UserSession {
  userId: number;
  cookie: {
    expires: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax" | "strict";
  };
}
