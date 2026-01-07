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

const shutdown = () => {
    console.log("Shutting down server");
    server.stop();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`task-price-service is running on port: ${ENV.PORT} in env: ${ENV.SERVICE_ENV}`);