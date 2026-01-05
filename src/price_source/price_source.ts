export interface PriceSource {
    readonly name: string;
    readonly url: string;

    getCurrentPrice(symbol: string): Promise<number>;
    getHistoricalPrice(symbol: string, timestamp: number): Promise<number>;
}