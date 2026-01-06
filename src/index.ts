import { mainHandler } from "./api/handler";
import { createPriceController, createPriceHistoricalController } from "./api/price.controller";
import { ENV } from "./config/env";
import { createAppContext } from "./context/app.context";

const ctx = createAppContext();

const server = Bun.serve({
    port: ENV.PORT,
    routes: {
        "/": () => new Response('Bun is FUN!'),
        "/price/:symbol": mainHandler(createPriceController(ctx)),
        "/price/historical/:symbol": mainHandler(createPriceHistoricalController(ctx))
    },
    fetch() {
        return new Response("unmatched route");
    }
});

console.log(`Listening on ${server.url}`);