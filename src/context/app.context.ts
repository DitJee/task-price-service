import type { PriceSource } from "../price_source/price_source";
import { PS_CoinGecko } from "../price_source/ps_coin_gecko";
import { PriceService } from "../service/price.service";

export interface AppContext {
    priceService: PriceService;
}

export function createAppContext(): AppContext {
    const sources: PriceSource[] = [
        new PS_CoinGecko()
    ];
    const priceService = new PriceService(sources)
    return {
        priceService
    }
}