"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    static convertMessage(msg) {
        let res = null;
        if (msg) {
            try {
                res = JSON.parse(msg.content.toString());
            }
            catch (e) {
                res = msg.content.toString();
            }
        }
        return res;
    }
}
exports.Logger = Logger;
//# sourceMappingURL=common.js.map