import type { AppContext } from "../context/app.context";

export function createPriceController(ctx: AppContext) {
    return async (req: Bun.BunRequest<"/price/:symbol">): Promise<Response> => {
        const symbol = req.params.symbol;
        const aggPrice = await ctx.priceService.getCurrentPrice(symbol);
        return new Response(`price for symbol: ${symbol} is ${aggPrice.priceUSD}`);
    }
}

export function createPriceHistoricalController(ctx: AppContext) {
    return async (req: Bun.BunRequest<"/price/historical/:symbol">): Promise<Response> => {
        const symbol = req.params.symbol;
        const url = new URL(req.url);
        const timestamp = Number(url.searchParams.get("timestamp"));
        const aggPrice = await ctx.priceService.getHistoricalPrice(symbol, timestamp);
        return new Response(`historical price for symbol: ${symbol} with timestamp of ${timestamp} is ${aggPrice.priceUSD}`);
    }
}