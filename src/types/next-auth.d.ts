import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: string;
    company: string
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string | undefined;
      emailVerified: Date | null | undefined;
      role: string,
      company: string
    };
  }
}