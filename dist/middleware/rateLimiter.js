"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rateLimit;
const lru_cache_1 = require("lru-cache");
function rateLimit(options) {
    const tokenCache = new lru_cache_1.LRUCache({
        max: (options === null || options === void 0 ? void 0 : options.uniqueTokenPerInterval) || 500,
        ttl: (options === null || options === void 0 ? void 0 : options.interval) || 60000,
    });
    return {
        check: (limit, token) => new Promise((resolve, reject) => {
            const tokenCount = tokenCache.get(token) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;
            if (isRateLimited) {
                return reject();
            }
            return resolve();
        }),
    };
}
