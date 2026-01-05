import type { PriceSource } from "./price_source";

export class PS_CoinGecko implements PriceSource {
    readonly name = "CoinGecko";
    readonly url = ""; // TODO: look up
    getCurrentPrice(symbol: string): Promise<number> {
        // TODO: need impl
        throw new Error("Method not implemented.");
    }
    getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        // TODO: need impl
        throw new Error("Method not implemented.");
    }

}