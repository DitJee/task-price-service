import { HttpError } from "../model/http_error";

export const mainHandler = (
    handler: (req: Bun.BunRequest<any>) => Promise<Response>
) => {
    return async (req: Bun.BunRequest<any>): Promise<Response> => {
        try {
            return await handler(req);
        } catch (err) {
            console.error(err);
            if (err instanceof HttpError) {
                return new Response(err.message, { status: err.status });
            }

            return new Response("Internal Server Error", { status: 500 });
        }
    };
}