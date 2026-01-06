export const nowUnix = (): number => {
    return Math.floor(Date.now() / 1000);
}

export const clampTimestampToLastNDays = (timestamp: number, nDay: number): number => {
    if (nDay < 0) {
        throw new Error("Invalid day");
    }
    const nDaysAgo = nowUnix() - nDay * 24 * 60 * 60;
    return Math.max(timestamp, nDaysAgo);
}