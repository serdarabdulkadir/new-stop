import type { NextConfig } from "next";

// Statik dışa aktarım: Netlify "out" klasörünü doğrudan yayınlar (sunucu gerekmez)
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  devIndicators: false,
  allowedDevOrigins: ["192.168.1.25", "192.168.1.110", "*.local"],
};

export default nextConfig;
