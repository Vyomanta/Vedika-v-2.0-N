const { backend } = require('./lib/backend.cjs');
const nextConfig = {
  compress: true,
  transpilePackages: ['feral-blob'],
  experimental: { optimizePackageImports: ['lucide-react', 'framer-motion', 'three', 'katex', '@upstash/redis', '@google/genai'] },
  // All LMS requests go through authenticated app/api/resource and app/api/method adapters.
};
module.exports = nextConfig;
