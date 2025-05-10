import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { locales } from "@/config";

// Define as rotas protegidas
const protectedRoutes = ["/dashboard", "/recargas", "/eventos", "/influenciadores", "/blacklist"];

export default async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const pathname = request.nextUrl.pathname;
  const defaultLocale = request.headers.get("kg-locale") || "pt";

  // 🔐 Protege rotas com ou sem locale
  const isProtected = protectedRoutes.some((path) =>
    pathname.startsWith(path) || pathname.startsWith(`/${defaultLocale}${path}`)
  );

  // ❌ Redireciona se não tiver token e tentar acessar rota protegida
  if (isProtected && !token) {
    return NextResponse.redirect(new URL(`/${defaultLocale}/auth/login`, request.url));
  }

  // 🌐 Internacionalização com next-intl
  const handleI18nRouting = createMiddleware({
    locales,
    defaultLocale,
  });

  const response = handleI18nRouting(request);
  response.headers.set("kg-locale", defaultLocale);

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en|pt)/:path*"],
};
