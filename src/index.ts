import { mainHandler } from "./api/handler";
import { createPriceController, createPriceHistoricalController } from "./api/price.controller";
import { ENV } from "./config/env";
import { createAppContext } from "./context/app.context";

const ctx = createAppContext();

const server = Bun.serve({
    port: ENV.PORT,
    routes: {
        "/": () => new Response('Bun is FUN!'),
        "/health": () => Response.json({
            service: ENV.SERVICE_NAME,
            uptime: process.uptime()
        }, 200),
        "/price/:symbol": mainHandler(createPriceController(ctx)),
        "/price/historical/:symbol": mainHandler(createPriceHistoricalController(ctx))
    },
    fetch() {
        return Response.json({
            error: "endpoint not found"
        }, 404);
    }
});

const shutdown = () => {
    console.log("Shutting down server");
    server.stop();
    process.exit(0);
};

process.on("SIGINT", shutdown); // interrupt
process.on("SIGTERM", shutdown); // terminate

console.log(`${ENV.SERVICE_NAME} is running on port: ${ENV.PORT} in env: ${ENV.SERVICE_ENV}`);