import type { PriceSource } from "./price_source";

const CoinGecko_Ids: Record<string, string> = {
    BTC: "bitcoin",
};

export class PS_CoinGecko implements PriceSource {
    readonly name = "CoinGecko";
    readonly url = "https://api.coingecko.com/api/v3"; // TODO: maybe move to config?
    async getCurrentPrice(symbol: string): Promise<number> {
        const id = this.getIdFromSymbol(symbol);

        const url = `${this.url}/simple/price?ids=${id}&vs_currencies=usd`; // TODO: maybe DJ the currency too?

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`CoinGecko current price failed`);
        }

        const data = await res.json() as any;
        const price = data?.[id]?.usd;

        console.log("[PS_CoinGecko][getCurrentPrice] price : ", price);

        return price;
    }
    getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        // TODO: need impl
        throw new Error("Method not implemented.");
    }


    private getIdFromSymbol(symbol: string): string {
        const id = CoinGecko_Ids[symbol.toUpperCase()];
        if (!id) {
            throw new Error(`[CoinGecko] unsupported symbol ${symbol}`);
        }
        return id;
    }
}