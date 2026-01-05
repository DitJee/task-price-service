
const server = Bun.serve({
    port: 3000,
    routes: {
        "/": () => new Response('Bun is FUN!'),
        "/price/:symbol": (req) => {
            // TODO: link controller
            return new Response(`price for symbol: ${req.params.symbol}`);
        },
        "/price/historical/:symbol": (req) => {
            // TODO: link controller
            const url = new URL(req.url);
            const timestamp = url.searchParams.get("timestamp");
            return new Response(`price for symbol: ${req.params.symbol} with timestamp of ${timestamp}`);
        }
    },
    fetch() {
        return new Response("unmatched route");
    }
});

console.log(`Listening on ${server.url}`);