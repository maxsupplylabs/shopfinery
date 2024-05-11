/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

module.exports = {
  images: {
    unoptimized: true,
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "img.freepik.com",
    ],
  },
  reactStrictMode: true,
};
