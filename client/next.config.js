/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images : {
    domains : ["i.pinimg.com", "cdn.discordapp.com"]
  },
  async rewrites() {
    return [
      {
        source: '/rootApi',
        destination: 'http://localhost:5000',
      },
    ]
  },
}
