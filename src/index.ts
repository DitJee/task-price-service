import { mainHandler } from "./api/handler";
import { createPriceController, createPriceHistoricalController } from "./api/price.controller";
import { ENV } from "./config/env";
import { createAppContext } from "./context/app.context";

const ctx = createAppContext();

const server = Bun.serve({
    port: ENV.PORT,
    routes: {
        "/": () => new Response('Bun is FUN!'),
        "/health": () => new Response(
            JSON.stringify({
                service: "task-price-service",
                uptime: process.uptime()
            }),
            {
                status: 200,
                headers: { "content-type": "application/json" },
            }
        ),
        "/price/:symbol": mainHandler(createPriceController(ctx)),
        "/price/historical/:symbol": mainHandler(createPriceHistoricalController(ctx))
    },
    fetch() {
        return new Response(
            JSON.stringify({ error: "endpoint not found" }),
            { status: 404 }
        );
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