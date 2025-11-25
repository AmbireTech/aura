"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyError = stringifyError;
function stringifyError(error) {
    return error instanceof Error ? error.message : JSON.stringify(error);
}
//# sourceMappingURL=errors.js.map