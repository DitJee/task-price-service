import { ENV } from "../config/env";
import { HttpError } from "../model/http_error";
import { clampTimestampToLastNDays } from "../util/time";
import type { PriceSource } from "./price_source";

const COINGECKO_IDS: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDC: "usd-coin",
};

export class PS_CoinGecko implements PriceSource {
    readonly name = "[CoinGecko]";
    readonly url = ENV.COINGECKO_API_URL;
    async getCurrentPrice(symbol: string): Promise<number> {
        const id = this.getIdFromSymbol(symbol);

        // https://docs.coingecko.com/reference/simple-price
        const url = `${this.url}/simple/price?ids=${id}&vs_currencies=usd`; // TODO: maybe DJ the currency too?

        const res = await fetch(url);
        if (!res.ok) {
            throw new HttpError(502, `${this.name} current price failed`);
        }

        const data = await res.json() as any;
        const price = data?.[id]?.usd;

        console.log(`${this.name}[getCurrentPrice] price : `, price);

        return price;
    }
    async getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        const id = this.getIdFromSymbol(symbol);
        const clampedTimestamp = clampTimestampToLastNDays(timestamp, ENV.MAX_HISTORY_NUM_DAY);
        const date = this.getCoinGeckoDateFromTimestamp(clampedTimestamp);

        // https://docs.coingecko.com/reference/coins-id-history
        const url = `${this.url}/coins/${id}/history?date=${date}&localization=false`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new HttpError(502, `${this.name} historical price failed`);
        }

        const data = await res.json() as any;
        const price = data?.market_data?.current_price?.usd;

        if (typeof price !== "number") {
            throw new HttpError(502, `${this.name} returned invalid historical price`);
        }

        console.log(`${this.name}[getHistoricalPrice] price : `, price);

        return price;
    }


    private getIdFromSymbol(symbol: string): string {
        const id = COINGECKO_IDS[symbol.toUpperCase()];

        if (!id) {
            throw new HttpError(400, `${this.name} unsupported symbol ${symbol}`);
        }
        return id;
    }

    // same format as https://docs.coingecko.com/reference/coins-id-market-chart-range 
    private getCoinGeckoDateFromTimestamp(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        const dd = String(date.getUTCDate()).padStart(2, "0"); // 2-digits format 
        const mm = String(date.getUTCMonth() + 1) // + 1 for 0-11 + 1
            .padStart(2, "0")// 2-digits format 
            ;
        const yyyy = date.getUTCFullYear();
        const outDate = `${yyyy}-${mm}-${dd}`;
        return outDate
    }
}