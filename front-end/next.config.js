const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { isServer }) => {
        // Clear webpack cache
        config.cache = false;
        return config;
    }
};

module.exports = nextConfig;
