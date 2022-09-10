import { client } from "config";
import { UserSession } from "types";

type GetSession = (sid: string) => Promise<UserSession | null>;

export const getSession: GetSession = async (sid) => {
  // retrieve the session with the sid (session id) from redis
  const session = await client.get(sid);

  if (!session) {
    return null;
  }

  // object is plain text, parse into json object and return
  const parsedSession: UserSession = JSON.parse(session);

  return parsedSession;
};
