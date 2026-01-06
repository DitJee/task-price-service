import { describe, it, expect } from "bun:test";
import { PS_Mock } from "../mock/ps_mock";
import { PriceCache } from "../../cache/price_cache";
import { PriceService } from "../../service/price.service";
import { TEST_SYMBOL } from "../constants.test";
import { nowUnix } from "../../util/time";


describe("PriceService", () => {
    it('should return reliable current price from multiple providers', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101),
            new PS_Mock("papa", 1000)
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        const price = await priceService.getCurrentPrice(TEST_SYMBOL);

        expect(price.priceUSD).toBe(100);
    });
    it('should return reliable historical price from multiple providers', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101),
            new PS_Mock("papa", 1000)
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        const price = await priceService.getHistoricalPrice(TEST_SYMBOL, nowUnix());

        expect(price.priceUSD).toBe(100);
    });
    it('should return reliable current price from multiple providers (with one provider failure)', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101, { shouldFail: true }),
            new PS_Mock("papa", 1000)
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        const price = await priceService.getCurrentPrice(TEST_SYMBOL);

        expect(price.priceUSD).toBe(100);
    });
    it('should return reliable historical price from multiple providers (with one provider failure)', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101, { shouldFail: true }),
            new PS_Mock("papa", 1000)
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        const price = await priceService.getHistoricalPrice(TEST_SYMBOL, nowUnix());

        expect(price.priceUSD).toBe(100);
    });
    it('should return 500 for all provider failure (current price)', async () => {
        const sources = [
            new PS_Mock("hehe", 99, { shouldFail: true }),
            new PS_Mock("hoho", 100, { shouldFail: true }),
            new PS_Mock("haha", 101, { shouldFail: true }),
            new PS_Mock("papa", 1000, { shouldFail: true })
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        try {
            const _price = await priceService.getCurrentPrice(TEST_SYMBOL);
        } catch (error) {
            expect((error as any).status).toBe(500);
        }
    });
    it('should return 500 for all provider failure (historical price)', async () => {
        const sources = [
            new PS_Mock("hehe", 99, { shouldFail: true }),
            new PS_Mock("hoho", 100, { shouldFail: true }),
            new PS_Mock("haha", 101, { shouldFail: true }),
            new PS_Mock("papa", 1000, { shouldFail: true })
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)

        try {
            const _price = await priceService.getHistoricalPrice(TEST_SYMBOL, nowUnix());
        } catch (error) {
            expect((error as any).status).toBe(500);
        }
    });
});
