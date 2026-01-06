import { HttpError } from "../model/http_error";
import type { AggregatedPrice } from "../model/price";
import type { PriceSource } from "../price_source/price_source";
import { median } from "../util/math";
import { nowUnix } from "../util/time";


enum EPriceQueryType {
    Current,
    Historical
}
export class PriceService {
    private readonly priceSources: PriceSource[];
    constructor(priceSources_: PriceSource[]) {
        this.priceSources = priceSources_;
    }

    async getCurrentPrice(symbol: string): Promise<AggregatedPrice> {
        return this.getAggrePrice(symbol, nowUnix(), EPriceQueryType.Current)
    }

    async getHistoricalPrice(symbol: string, timestamp: number): Promise<AggregatedPrice> {
        return this.getAggrePrice(symbol, timestamp, EPriceQueryType.Historical)
    }

    private async getAggrePrice(symbol: string, timestamp: number, queryType: EPriceQueryType): Promise<AggregatedPrice> {
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
        }

        if (prices.length == 0) {
            throw new HttpError(500, "All price sources failed!!!");
        }

        const aggPrice = median(prices);

        console.log("[PriceService][getAggrePrice] aggPrice : ", aggPrice);

        return {
            priceUSD: aggPrice, symbol, timestamp
        }
    }
}