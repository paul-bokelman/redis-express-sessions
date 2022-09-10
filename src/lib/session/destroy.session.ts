import { client } from "config";

type DestroySession = (sid: string) => Promise<void>;

export const destroySession: DestroySession = async (sid) => {
  try {
    // find and delete record in redis
    await client.del(sid);
    return;
  } catch (error) {
    throw new Error("Failed to destroy session");
  }
};
