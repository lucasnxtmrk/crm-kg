import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales } from "@/config";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const defaultLocale = request.headers.get("kg-locale") || "pt";

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
