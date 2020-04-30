"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const chai_1 = require("chai");
require("mocha");
describe('Common', () => {
    it('should convert a string to a string', () => {
        const message = common_1.Logger.convertMessage({
            fields: {
                deliveryTag: 1,
                redelivered: false,
                exchange: 'exchange',
                routingKey: 'test.test'
            },
            properties: {
                contentType: undefined,
                contentEncoding: undefined,
                headers: {},
                deliveryMode: undefined,
                priority: undefined,
                correlationId: undefined,
                replyTo: undefined,
                expiration: undefined,
                messageId: undefined,
                timestamp: undefined,
                type: undefined,
                userId: undefined,
                appId: undefined,
                clusterId: undefined
            },
            content: Buffer.from('test')
        });
        chai_1.expect(message).to.exist;
        chai_1.expect(message).to.equal('test');
    });
    it('should convert a stringified JSON to a JSON', () => {
        const message = common_1.Logger.convertMessage({
            fields: {
                deliveryTag: 1,
                redelivered: false,
                exchange: 'exchange',
                routingKey: 'test.test'
            },
            properties: {
                contentType: undefined,
                contentEncoding: undefined,
                headers: {},
                deliveryMode: undefined,
                priority: undefined,
                correlationId: undefined,
                replyTo: undefined,
                expiration: undefined,
                messageId: undefined,
                timestamp: undefined,
                type: undefined,
                userId: undefined,
                appId: undefined,
                clusterId: undefined
            },
            content: Buffer.from('{"test":"data"}')
        });
        chai_1.expect(message).to.exist;
        chai_1.expect(message.test).to.equal('data');
    });
});
//# sourceMappingURL=common.test.js.map