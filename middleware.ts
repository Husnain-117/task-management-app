import { withAuth } from "next-auth/middleware";
import { authOptions } from "@/lib/auth";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Configure protected routes
export const config = {
  matcher: ['/dashboard/:path*', '/edit/:path*']
}; 