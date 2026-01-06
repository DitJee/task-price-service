const requireEnv = (key: keyof typeof Bun.env): string => {
    const value = Bun.env[key];
    if (!value) {
        throw new Error(`Missing env var: ${key}`);
    }
    return value;
}

const parseNumber = (value: string): number => {
    const num = Number(value);
    if (!Number.isFinite(num)) {
        throw new Error(`Env var must be a number`);
    }
    return num;
}

export const ENV = {
    COINGECKO_API_URL: requireEnv("COINGECKO_API_URL"),
    MAX_HISTORY_NUM_DAY: parseNumber(requireEnv("MAX_HISTORY_NUM_DAY"))
};