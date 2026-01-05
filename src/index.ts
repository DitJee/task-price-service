import { createPriceController, createPriceHistoricalController } from "./api/price.controller";
import { createAppContext } from "./context/app.context";

const ctx = createAppContext();
const handler_price = createPriceController(ctx);
const handler_price_historical = createPriceHistoricalController(ctx);

const server = Bun.serve({
    port: 3000,
    routes: {
        "/": () => new Response('Bun is FUN!'),
        "/price/:symbol": handler_price,
        "/price/historical/:symbol": handler_price_historical
    },
    fetch() {
        return new Response("unmatched route");
    }
});

console.log(`Listening on ${server.url}`);