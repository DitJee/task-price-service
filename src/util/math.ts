
export const median = (vals: number[]): number => {
    if (vals.length == 0) {
        throw new Error("empty vals")
    }

    const sorted = [...vals].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 === 0
        ? (sorted[mid - 1]! + sorted[mid]!) / 2 // avg if even
        : sorted[mid]!
        ;
}