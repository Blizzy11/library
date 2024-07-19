import { auth as middleware } from "@/auth";
import { publicRoutes, authRoutes, apiAuthPrefix } from "@/routes";

export default middleware((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isLoggedIn = !!req.auth;

  const isApiAuthPrefix = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if (isApiAuthPrefix) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (session && session.user.role === "ADMIN") {
        return Response.redirect(new URL("/admin", req.nextUrl.origin));
      } else {
        return Response.redirect(new URL("/app", req.nextUrl.origin));
      }
    } else {
      return;
    }
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/signin", req.nextUrl.origin));
  }

  // prevent user accessing admin route
  if (
    session &&
    session.user.role === "USER" &&
    nextUrl.pathname.startsWith("/admin")
  ) {
    return Response.redirect(new URL("/app", req.nextUrl.origin));
  }

  // prevent admin accessing user route
  if (
    session &&
    session.user.role === "ADMIN" &&
    nextUrl.pathname.startsWith("/app")
  ) {
    return Response.redirect(new URL("/admin", req.nextUrl.origin));
  }

  return;
  // if (!req.auth && !publicRoutes.includes(req.nextUrl.pathname)) {
  //   const newUrl = new URL("/signin", req.nextUrl.origin);
  //   return Response.redirect(newUrl);
  // }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
