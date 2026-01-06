import { ENV } from "../config/env";
import { HttpError } from "../model/http_error";
import { clampTimestampToLastNDays } from "../util/time";
import type { PriceSource } from "./price_source";


export class PS_CoinMarketCap implements PriceSource {
    readonly name = "[CoinMarketCap]";
    readonly url = ENV.COINMARKETCAP_API_URL;
    async getCurrentPrice(symbol: string): Promise<number> {

        // https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
        const url = `${this.url}/v2/cryptocurrency/quotes/latest?symbol=${symbol.toUpperCase()}`;

        const res = await fetch(url, {
            headers: {
                "X-CMC_PRO_API_KEY": ENV.COINMARKETCAP_API_KEY,
            },
        });


        if (!res.ok) {
            throw new HttpError(502, `${this.name} current price failed`);
        }

        const data = await res.json() as any;

        const BTCs = data?.data?.[symbol.toUpperCase()];

        const price =
            Array.isArray(BTCs) && BTCs.length > 0
                ? BTCs[0]?.quote?.USD?.price
                : null;

        if (typeof price !== "number") {
            throw new HttpError(502, `${this.name} returned invalid current price`);
        }

        console.log(`${this.name}[getCurrentPrice] price : `, price);

        return price;
    }
    async getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        const clampedTimestamp = clampTimestampToLastNDays(timestamp, ENV.MAX_HISTORY_NUM_DAY);

        // https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesHistorical 
        // TODO: this endpoint is forbidden for basic API key uWu
        const url = `${this.url}/v2/cryptocurrency/quotes/historical?symbol=${symbol.toUpperCase()}&time_start=${clampedTimestamp}&time_end=${clampedTimestamp}&interval=1m`;

        const res = await fetch(url, {
            headers: {
                "X-CMC_PRO_API_KEY": ENV.COINMARKETCAP_API_KEY,
            },
        });

        // console.log(`${this.name}[getHistoricalPrice] res : `, res);

        if (!res.ok) {
            throw new HttpError(502, `${this.name} historical price failed`);
        }

        const data = await res.json() as any;

        const BTCs = data?.data?.[symbol.toUpperCase()];

        const price =
            Array.isArray(BTCs) && BTCs.length > 0
                ? BTCs[0]?.quote?.USD?.price
                : null;

        if (typeof price !== "number") {
            throw new HttpError(502, `${this.name} returned invalid historical price`);
        }

        console.log(`${this.name}[getHistoricalPrice] price : `, price);

        return price;
    }
}