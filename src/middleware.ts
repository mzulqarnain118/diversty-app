import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
});

// add public routes to below regex
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|auth/login|auth/signup|auth/verify|auth/resetPassword|auth/forgotPassword|user/response|user/consent|api/v1/user/survey|api/v1/user/gdpr|api/v1/gdpr-template|api/v1/user/consent|_vercel/speed-insights).*)",
  ],
};
