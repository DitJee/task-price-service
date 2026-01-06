import { describe, it, expect } from "bun:test";
import { filterOutliers_IQR, median, robustMedian } from "../../util/math";

describe("MATH", () => {
    it('should filters out extreme outliers', async () => {
        const vals = [99, 100, 101, 102, 10_000]
        const filtered = filterOutliers_IQR(vals);
        expect(filtered.includes(10_000)).toBe(false);
    });
    it('should give the correct median (odd array)', async () => {
        const vals = [99, 100, 101, 102, 10_000]
        const myMedian = median(vals);
        expect(myMedian).toBe(101);
    });
    it('should give the correct median (even array)', async () => {
        const vals = [99, 100, 101, 102, 103, 10_000]
        const myMedian = median(vals);
        expect(myMedian).toBe(101.5);
    });
    it('should give the correct median after outlier elimination', async () => {
        const vals = [1, 99, 100, 101, 102, 103, 10_000]
        const myMedian = robustMedian(vals);
        expect(myMedian).toBe(101);
    });
});