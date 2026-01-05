import type { AggregatedPrice } from "../model/price";
import type { PriceSource } from "../price_source/price_source";



export class PriceService {
    private readonly priceSources: PriceSource[];
    constructor(priceSources_: PriceSource[]) {
        this.priceSources = priceSources_;
    }

    async getCurrentPrice(symbol: string): Promise<AggregatedPrice> {
        // TODO: need impl
        return {
            priceUSD: 0, symbol, timestamp: 0
        }
    }

    async getHistoricalPrice(symbol: string,
        timestamp: number): Promise<AggregatedPrice> {
        // TODO: need impl
        return {
            priceUSD: 0, symbol, timestamp
        }
    }
}