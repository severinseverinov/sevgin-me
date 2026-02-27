import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes
    // - Next.js internals (_next)
    // - Static files (favicon, images, etc.)
    // - Admin panel
    // - Login page
    "/((?!api|_next|admin|login|.*\\..*).*)",
  ],
};
