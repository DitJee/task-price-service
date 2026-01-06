
export const robustMedian = (vals: number[]): number => {
    if (vals.length == 0) {
        throw new Error("empty vals")
    }

    const filtered = filterOutliers_IQR(vals);
    // safety fallback if IQR cut too much samples
    const finalVals = filtered.length >= Math.ceil(vals.length / 2) ? filtered : vals;
    return median(finalVals);
}

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

// The purpose of IQR is to filter out 'bad' samples
// using just median allows 'bad' sample to be weighted more than it should be
// for example
// [100, 101, 102, 10000, 11000]
// median = 102 (still biased upward)
// IQR = 101 (more fair)
// 
export const filterOutliers_IQR = (vals: number[]): number[] => {
    // IQR is not reliable for very small samples
    if (vals.length < 4) {
        return vals;
    }

    const sorted = [...vals].sort((a, b) => a - b);
    const q1 = percentile(sorted, 0.25);
    const q3 = percentile(sorted, 0.75);
    const iqr = q3 - q1;

    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    return sorted.filter((a) => a >= lower && a <= upper);
}

export const percentile = (sorted: number[], p: number): number => {
    const idx = (sorted.length - 1) * p;
    const low = Math.floor(idx);
    const high = Math.ceil(idx);
    if (low == high) {
        return sorted.at(low)!;
    }
    const weight = idx - low;
    return sorted.at(low)! * (1 - weight) + sorted[high]! * weight;
}