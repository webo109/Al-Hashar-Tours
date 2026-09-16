import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Internal tools (test-report, admin) live outside the locale segment.
  matcher: "/((?!api|trpc|_next|_vercel|test-report|admin|.*\\..*).*)",
};
