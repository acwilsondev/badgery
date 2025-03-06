/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // Tell Remix where to find the server and client entry points
  serverBuildTarget: "node-cjs",
  server: "./server.js",
  
  // Specify the location of public assets
  publicPath: "/build/",
  assetsBuildDirectory: "public/build",
  
  // Where to store server build files
  serverBuildPath: "build/index.js",
  
  // Configure path aliases for cleaner imports
  // These match the paths configured in tsconfig.json
  routes: async (defineRoutes) => {
    return defineRoutes((_route) => {
      // Define your routes here if you need custom route definitions
    });
  },

  // Configure path aliases for cleaner imports
  ignoredRouteFiles: ["**/.*"],
  
  // Add path aliases that match tsconfig.json paths
  serverModuleFormat: "cjs",
  
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
  
  // Enable MDX support if needed
  // mdx: async (filename) => {
  //   const [rehypeHighlight, remarkToc] = await Promise.all([
  //     import("rehype-highlight").then((mod) => mod.default),
  //     import("remark-toc").then((mod) => mod.default),
  //   ]);
  //   return {
  //     remarkPlugins: [remarkToc],
  //     rehypePlugins: [rehypeHighlight],
  //   };
  // },
};

