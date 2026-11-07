/** @type {import('next').NextConfig} */
const nextConfig = {
  // The only image is a small Google avatar, so the optimizer isn't worth exposing.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // No script-src: Next's inline scripts would need per-request nonces,
          // which would make every static page dynamic.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
        ],
      },
    ]
  },
}
module.exports = nextConfig
