export interface AuthenticatedRequest {
  isAuthenticated: boolean;
  sid: string | null;
  locals: {
    user: {
      id: number;
      username: string;
      password: string;
    } | null;
  };
}

declare module "express-serve-static-core" {
  export interface Request extends AuthenticatedRequest {}
}
