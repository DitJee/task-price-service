import type { PriceCache } from "../cache/price_cache";
import { HttpError } from "../model/http_error";
import type { AggregatedPrice } from "../model/price";
import type { PriceSource } from "../price_source/price_source";
import { median, robustMedian } from "../util/math";
import { nowUnix } from "../util/time";


enum EPriceQueryType {
    Current,
    Historical
}
export class PriceService {
    private readonly priceSources: PriceSource[];
    private readonly priceCache: PriceCache;

    constructor(priceSources_: PriceSource[], priceCache_: PriceCache) {
        this.priceSources = priceSources_;
        this.priceCache = priceCache_;
    }

    async getCurrentPrice(symbol: string): Promise<AggregatedPrice> {
        return this.getAggrePrice(symbol, nowUnix(), EPriceQueryType.Current)
    }

    async getHistoricalPrice(symbol: string, timestamp: number): Promise<AggregatedPrice> {
        return this.getAggrePrice(symbol, timestamp, EPriceQueryType.Historical)
    }

    private async getAggrePrice(symbol: string, timestamp: number, queryType: EPriceQueryType): Promise<AggregatedPrice> {
        // not sure how sure current price query should be handled
        // I will just have it misses the cache for now
        const cacheKey = `${symbol}_${timestamp}`;
        const cache = this.priceCache.get(cacheKey);;
        if (cache) {
            // console.log("cache: ", cache)
            return {
                priceUSD: cache, symbol, timestamp
            }
        }

        const results = await Promise.allSettled(
            this.priceSources.map(
                (src) =>
                    queryType == EPriceQueryType.Current
                        ? src.getCurrentPrice(symbol)
                        : src.getHistoricalPrice(symbol, timestamp)
            )
        );

        const prices: number[] = [];
        for (const res of results) {
            if (res.status == "fulfilled") {
                prices.push(res.value);
            }
            else {
                console.warn(res.reason);
            }
        }

        if (prices.length == 0) {
            throw new HttpError(500, "All price sources failed!!!");
        }

        const aggPrice = robustMedian(prices);

        this.priceCache.set(cacheKey, aggPrice);

        console.log("[PriceService][getAggrePrice] aggPrice : ", aggPrice);

        return {
            priceUSD: aggPrice, symbol, timestamp
        }
    }
}