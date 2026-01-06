import type { PriceSource } from "../../price_source/price_source";
import type { BunRequest } from "bun";

export class PS_Mock implements PriceSource {
    name: string;
    url: string = "";
    private price: number;
    delayMs: number;
    private shouldFail: boolean;

    constructor(name: string, price: number, options?: { delayMs?: number, shouldFail: boolean }) {
        this.name = name;
        this.price = price;
        this.delayMs = options?.delayMs ?? 0;
        this.shouldFail = options?.shouldFail ?? false;
    }

    async getCurrentPrice(symbol: string): Promise<number> {
        await Bun.sleep(this.delayMs);
        if (this.shouldFail) {
            throw new Error(`${this.name} mock failure`);
        }
        return this.price;
    }
    async getHistoricalPrice(symbol: string, timestamp: number): Promise<number> {
        return this.getCurrentPrice(symbol);
    }
}


export const mockBunRequest = <T extends string>(
    url: string,
    method: string,
    params?: Record<string, string>
): BunRequest<T> => {
    const req = new Request(url, { method }) as BunRequest<T>;
    (req as any).params = params;
    return req;
}