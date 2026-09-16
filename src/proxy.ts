import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // The private report and client admin preview use dedicated, non-intl routes.
  matcher: "/((?!api|trpc|_next|_vercel|test-report|admin|en/admin|.*\\..*).*)",
};
