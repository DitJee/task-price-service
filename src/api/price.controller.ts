import type { AppContext } from "../context/app.context";
import { HttpError } from "../model/http_error";
import { isSupportedToken } from "../util/token";

export const createPriceController = (ctx: AppContext) => {
    return async (req: Bun.BunRequest<"/price/:symbol">): Promise<Response> => {
        const symbol = req.params.symbol;
        if (!isSupportedToken(symbol)) {
            throw new HttpError(400, `${symbol} is not supported`);
        }
        const aggPrice = await ctx.priceService.getCurrentPrice(symbol);
        return Response.json({
            aggPrice
        });
    }
}

export const createPriceHistoricalController = (ctx: AppContext) => {
    return async (req: Bun.BunRequest<"/price/historical/:symbol">): Promise<Response> => {
        const symbol = req.params.symbol;
        if (!isSupportedToken(symbol)) {
            throw new HttpError(400, `${symbol} is not supported`);
        }
        const url = new URL(req.url);
        const timestamp = Number(url.searchParams.get("timestamp"));
        const aggPrice = await ctx.priceService.getHistoricalPrice(symbol, timestamp);
        return Response.json({
            aggPrice
        });
    }
}