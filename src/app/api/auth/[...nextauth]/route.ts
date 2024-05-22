import { authOptions } from "@/lib/NextAuth/NextAuthConfig";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
