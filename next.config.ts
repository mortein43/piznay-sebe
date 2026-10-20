import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // unauthorized() and forbidden() give the admin pages real 401 and 403 responses.
    authInterrupts: true,
  },
};

export default nextConfig;
