const requireEnv = (key: keyof typeof Bun.env): string => {
    const value = Bun.env[key];
    if (!value) {
        throw new Error(`Missing env var: ${key}`);
    }
    return value;
}

export const ENV = {
    COINGECKO_API_URL: requireEnv("COINGECKO_API_URL"),
};