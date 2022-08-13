/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/rootApi',
        destination: 'http://localhost:5000',
      },
    ]
  },
}
