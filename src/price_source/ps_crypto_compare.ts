import { ENV } from "../config/env";
import { HttpError } from "../model/http_error";
import { clampTimestampToLastNDays } from "../util/time";
import type { PriceSource } from "./price_source";


export class PS_CryptoCompare implements PriceSource {
    readonly name = "[CryptoCompare]";
    readonly url = ENV.CRYPTOCOMPARE_API_URL;
    async getCurrentPrice(symbol: string): Promise<number> {

        // https://developers.coindesk.com/documentation/legacy/Price/SingleSymbolPriceEndpoint/ 
        const url = `${this.url}/data/price?fsym=${symbol.toUpperCase()}&tsyms=USD`; // TODO: maybe DJ the currency too?

        const res = await fetch(url);
        if (!res.ok) {
            throw new HttpError(502, `${this.name} current price failed`);
        }

        const data = await res.json() as any;
        const price = data?.USD;

        if (typeof price !== "number") {
            throw new HttpError(502, `${this.name} returned invalid current price`);
        }

        console.log(`${this.name}[getCurrentPrice] price : `, price);

        return price;
    }
    async getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        const clampedTimestamp = clampTimestampToLastNDays(timestamp, ENV.MAX_HISTORY_NUM_DAY);

        // https://developers.coindesk.com/documentation/legacy/Historical/dataHistominute 
        const url = `${this.url}/data/v2/histominute?fsym=${symbol.toUpperCase()}&tsym=USD&limit=1&toTs=${clampedTimestamp}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new HttpError(502, `${this.name} historical price failed`);
        }

        const data = await res.json() as any;
        const candle = data?.Data?.Data?.[0];
        const price = candle?.close;

        if (typeof price !== "number") {
            throw new HttpError(502, `${this.name} returned invalid historical price`);
        }

        console.log(`${this.name}[getHistoricalPrice] price : `, price);

        return price;
    }
}