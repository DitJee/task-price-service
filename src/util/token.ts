import { SUPPORTED_TOKENS } from "../config/supported_token"

export const isSupportedToken = (symbol: string): boolean => {
    return SUPPORTED_TOKENS.includes(symbol);
}