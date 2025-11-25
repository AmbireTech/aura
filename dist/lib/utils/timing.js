"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutPromise = timeoutPromise;
function timeoutPromise(promise, timeoutSeconds, errorMsg) {
    let timer;
    const timeout = new Promise((_, reject) => (timer = setTimeout(() => reject(new Error(errorMsg || 'Request timeout')), timeoutSeconds * 1000)));
    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout]);
}
//# sourceMappingURL=timing.js.map