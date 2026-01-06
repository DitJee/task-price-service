import { describe, it, expect } from "bun:test";
import { mockBunRequest, PS_Mock } from "../mock/ps_mock";
import { PriceCache } from "../../cache/price_cache";
import { PriceService } from "../../service/price.service";
import { createPriceController, createPriceHistoricalController } from "../../api/price.controller";
import { TEST_BAD_SYMBOL } from "../constants.test";

describe("PriceController", () => {
    it('should prevent unsupported symbol (/price/:symbol)', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101),
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)
        const handler = createPriceController({ priceService });
        const req = mockBunRequest<"/price/:symbol">(
            `http://localhost/price/${TEST_BAD_SYMBOL}`,
            "GET",
            { symbol: TEST_BAD_SYMBOL }
        );
        try {
            const _res = await handler(req);
        } catch (error) {
            expect((error as any).status).toBe(400);
        }
    });
    it('should prevent unsupported symbol (/price/historical/:symbol)', async () => {
        const sources = [
            new PS_Mock("hehe", 99),
            new PS_Mock("hoho", 100),
            new PS_Mock("haha", 101),
        ];

        const priceCache = new PriceCache();
        const priceService = new PriceService(sources, priceCache)
        const handler = createPriceHistoricalController({ priceService });
        const req = mockBunRequest<"/price/historical/:symbol">(
            `http://localhost/price/historical/${TEST_BAD_SYMBOL}`,
            "GET",
            { symbol: TEST_BAD_SYMBOL }
        );
        try {
            const _res = await handler(req);
        } catch (error) {
            expect((error as any).status).toBe(400);
        }
    });
});
