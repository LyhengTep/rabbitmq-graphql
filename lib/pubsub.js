"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMQPPubSub = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var amqp = _interopRequireWildcard(require("amqplib"));

var _debug = _interopRequireDefault(require("debug"));

var _publisher = require("./amqp/publisher");

var _subscriber = require("./amqp/subscriber");

var _pubsubAsyncIterator = require("./pubsub-async-iterator");

var _helper = require("./helper");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var logger = (0, _debug["default"])("AMQPPubSub");

var AMQPPubSub = /*#__PURE__*/function () {
  function AMQPPubSub() {
    var queue_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "graphql_queue";
    (0, _classCallCheck2["default"])(this, AMQPPubSub);
    (0, _defineProperty2["default"])(this, "connection", void 0);
    (0, _defineProperty2["default"])(this, "exchange", void 0);
    (0, _defineProperty2["default"])(this, "queue_name", void 0);
    (0, _defineProperty2["default"])(this, "publisher", void 0);
    (0, _defineProperty2["default"])(this, "subscriber", void 0);
    (0, _defineProperty2["default"])(this, "subscriptionMap", void 0);
    (0, _defineProperty2["default"])(this, "subsRefsMap", void 0);
    (0, _defineProperty2["default"])(this, "unsubscribeMap", void 0);
    (0, _defineProperty2["default"])(this, "currentSubscriptionId", void 0);
    // Setup Variables
    this.queue_name = queue_name;
    this.subscriptionMap = {};
    this.subsRefsMap = {};
    this.unsubscribeMap = {};
    this.currentSubscriptionId = 0;
    logger("Finished initializing");
  }

  (0, _createClass2["default"])(AMQPPubSub, [{
    key: "connect",
    value: function () {
      var _connect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(config) {
        var _this = this;

        var url;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = (0, _helper.buildConnectionString)(config);
                return _context.abrupt("return", amqp.connect(url).then(function (conn) {
                  _this.connection = conn; // Initialize AMQP Helper

                  _this.publisher = new _publisher.AMQPPublisher(_this.connection, logger);
                  _this.subscriber = new _subscriber.AMQPSubscriber(_this.connection, logger);
                })["catch"](function (e) {
                  console.log("error", e);
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function connect(_x) {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "publish",
    value: function () {
      var _publish = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(routingKey, payload) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                logger('Publishing message to exchange "%s" for key "%s" (%j)', this.exchange, routingKey, payload);
                return _context2.abrupt("return", this.publisher.publish(this.exchange, routingKey, payload));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function publish(_x2, _x3) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
  }, {
    key: "subscribe",
    value: function () {
      var _subscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(routingKey, onMessage) {
        var _this2 = this;

        var id, refs, newRefs;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                id = this.currentSubscriptionId++;
                this.subscriptionMap[id] = {
                  routingKey: routingKey,
                  listener: onMessage
                };
                refs = this.subsRefsMap[routingKey];

                if (!(refs && refs.length > 0)) {
                  _context3.next = 9;
                  break;
                }

                newRefs = [].concat((0, _toConsumableArray2["default"])(refs), [id]);
                this.subsRefsMap[routingKey] = newRefs;
                return _context3.abrupt("return", Promise.resolve(id));

              case 9:
                return _context3.abrupt("return", this.subscriber.subscribe(this.queue_name, routingKey, this.onMessage.bind(this)).then(function (disposer) {
                  _this2.subsRefsMap[routingKey] = [].concat((0, _toConsumableArray2["default"])(_this2.subsRefsMap[routingKey] || []), [id]);

                  if (_this2.unsubscribeMap[routingKey]) {
                    return disposer();
                  }

                  _this2.unsubscribeMap[routingKey] = disposer;
                  return Promise.resolve(id);
                }));

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function subscribe(_x4, _x5) {
        return _subscribe.apply(this, arguments);
      }

      return subscribe;
    }()
  }, {
    key: "unsubscribe",
    value: function unsubscribe(subId) {
      var routingKey = this.subscriptionMap[subId].routingKey;
      var refs = this.subsRefsMap[routingKey];

      if (!refs) {
        throw new Error("There is no subscription of id \"".concat(subId, "\""));
      }

      if (refs.length === 1) {
        delete this.subscriptionMap[subId];
        return this.unsubscribeForKey(routingKey);
      } else {
        var index = refs.indexOf(subId);
        var newRefs = index === -1 ? refs : [].concat((0, _toConsumableArray2["default"])(refs.slice(0, index)), (0, _toConsumableArray2["default"])(refs.slice(index + 1)));
        this.subsRefsMap[routingKey] = newRefs;
        delete this.subscriptionMap[subId];
      }

      return Promise.resolve();
    }
  }, {
    key: "asyncIterator",
    value: function asyncIterator(triggers) {
      return new _pubsubAsyncIterator.PubSubAsyncIterator(this, triggers);
    }
  }, {
    key: "onMessage",
    value: function onMessage(routingKey, message) {
      var subscribers = this.subsRefsMap[routingKey]; // Don't work for nothing..

      if (!subscribers || !subscribers.length) {
        this.unsubscribeForKey(routingKey);
        return;
      }

      var _iterator = _createForOfIteratorHelper(subscribers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _subId = _step.value;

          this.subscriptionMap[_subId].listener(message);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "unsubscribeForKey",
    value: function () {
      var _unsubscribeForKey = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(routingKey) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.unsubscribeMap[routingKey]();

              case 2:
                delete this.subsRefsMap[routingKey];
                delete this.unsubscribeMap[routingKey];

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function unsubscribeForKey(_x6) {
        return _unsubscribeForKey.apply(this, arguments);
      }

      return unsubscribeForKey;
    }()
  }]);
  return AMQPPubSub;
}();

exports.AMQPPubSub = AMQPPubSub;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wdWJzdWIudHMiXSwibmFtZXMiOlsibG9nZ2VyIiwiQU1RUFB1YlN1YiIsInF1ZXVlX25hbWUiLCJzdWJzY3JpcHRpb25NYXAiLCJzdWJzUmVmc01hcCIsInVuc3Vic2NyaWJlTWFwIiwiY3VycmVudFN1YnNjcmlwdGlvbklkIiwiY29uZmlnIiwidXJsIiwiYW1xcCIsImNvbm5lY3QiLCJ0aGVuIiwiY29ubiIsImNvbm5lY3Rpb24iLCJwdWJsaXNoZXIiLCJBTVFQUHVibGlzaGVyIiwic3Vic2NyaWJlciIsIkFNUVBTdWJzY3JpYmVyIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJyb3V0aW5nS2V5IiwicGF5bG9hZCIsImV4Y2hhbmdlIiwicHVibGlzaCIsIm9uTWVzc2FnZSIsImlkIiwibGlzdGVuZXIiLCJyZWZzIiwibGVuZ3RoIiwibmV3UmVmcyIsIlByb21pc2UiLCJyZXNvbHZlIiwic3Vic2NyaWJlIiwiYmluZCIsImRpc3Bvc2VyIiwic3ViSWQiLCJFcnJvciIsInVuc3Vic2NyaWJlRm9yS2V5IiwiaW5kZXgiLCJpbmRleE9mIiwic2xpY2UiLCJ0cmlnZ2VycyIsIlB1YlN1YkFzeW5jSXRlcmF0b3IiLCJtZXNzYWdlIiwic3Vic2NyaWJlcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHLHVCQUFNLFlBQU4sQ0FBZjs7SUFFYUMsVTtBQWNYLHdCQUFrRDtBQUFBLFFBQXRDQyxVQUFzQyx1RUFBakIsZUFBaUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNoRDtBQUVBLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCLEVBQXRC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LEtBQUtoQixjQUFMLENBQW9CZ0IsVUFBcEIsRzs7O0FBQ04sdUJBQU8sS0FBS2pCLFdBQUwsQ0FBaUJpQixVQUFqQixDQUFQO0FBQ0EsdUJBQU8sS0FBS2hCLGNBQUwsQ0FBb0JnQixVQUFwQixDQUFQIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHViU3ViRW5naW5lIH0gZnJvbSBcImdyYXBocWwtc3Vic2NyaXB0aW9uc1wiO1xuaW1wb3J0ICogYXMgYW1xcCBmcm9tIFwiYW1xcGxpYlwiO1xuaW1wb3J0IERlYnVnIGZyb20gXCJkZWJ1Z1wiO1xuXG5pbXBvcnQgeyBQdWJTdWJBTVFQT3B0aW9ucywgUHViU3ViQ29ubmVjdGlvbkNvbmZpZyB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IEFNUVBQdWJsaXNoZXIgfSBmcm9tIFwiLi9hbXFwL3B1Ymxpc2hlclwiO1xuaW1wb3J0IHsgQU1RUFN1YnNjcmliZXIgfSBmcm9tIFwiLi9hbXFwL3N1YnNjcmliZXJcIjtcbmltcG9ydCB7IFB1YlN1YkFzeW5jSXRlcmF0b3IgfSBmcm9tIFwiLi9wdWJzdWItYXN5bmMtaXRlcmF0b3JcIjtcbmltcG9ydCB7IGJ1aWxkQ29ubmVjdGlvblN0cmluZyB9IGZyb20gXCIuL2hlbHBlclwiO1xuXG5jb25zdCBsb2dnZXIgPSBEZWJ1ZyhcIkFNUVBQdWJTdWJcIik7XG5cbmV4cG9ydCBjbGFzcyBBTVFQUHViU3ViIGltcGxlbWVudHMgUHViU3ViRW5naW5lIHtcbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBhbXFwLkNvbm5lY3Rpb247XG4gIHByaXZhdGUgZXhjaGFuZ2U6IHN0cmluZztcbiAgcHJpdmF0ZSBxdWV1ZV9uYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcHVibGlzaGVyOiBBTVFQUHVibGlzaGVyO1xuICBwcml2YXRlIHN1YnNjcmliZXI6IEFNUVBTdWJzY3JpYmVyO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uTWFwOiB7XG4gICAgW3N1YklkOiBudW1iZXJdOiB7IHJvdXRpbmdLZXk6IHN0cmluZzsgbGlzdGVuZXI6IEZ1bmN0aW9uIH07XG4gIH07XG4gIHByaXZhdGUgc3Vic1JlZnNNYXA6IHsgW3RyaWdnZXI6IHN0cmluZ106IEFycmF5PG51bWJlcj4gfTtcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZU1hcDogeyBbdHJpZ2dlcjogc3RyaW5nXTogKCkgPT4gUHJvbWlzZUxpa2U8YW55PiB9O1xuICBwcml2YXRlIGN1cnJlbnRTdWJzY3JpcHRpb25JZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKHF1ZXVlX25hbWU6IHN0cmluZyA9IFwiZ3JhcGhxbF9xdWV1ZVwiKSB7XG4gICAgLy8gU2V0dXAgVmFyaWFibGVzXG5cbiAgICB0aGlzLnF1ZXVlX25hbWUgPSBxdWV1ZV9uYW1lO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uTWFwID0ge307XG4gICAgdGhpcy5zdWJzUmVmc01hcCA9IHt9O1xuICAgIHRoaXMudW5zdWJzY3JpYmVNYXAgPSB7fTtcbiAgICB0aGlzLmN1cnJlbnRTdWJzY3JpcHRpb25JZCA9IDA7XG4gICAgbG9nZ2VyKFwiRmluaXNoZWQgaW5pdGlhbGl6aW5nXCIpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNvbm5lY3QoY29uZmlnOiBQdWJTdWJDb25uZWN0aW9uQ29uZmlnKSB7XG4gICAgY29uc3QgdXJsID0gYnVpbGRDb25uZWN0aW9uU3RyaW5nKGNvbmZpZyk7XG4gICAgcmV0dXJuIGFtcXBcbiAgICAgIC5jb25uZWN0KHVybClcbiAgICAgIC50aGVuKChjb25uKSA9PiB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IGNvbm47XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBBTVFQIEhlbHBlclxuICAgICAgICB0aGlzLnB1Ymxpc2hlciA9IG5ldyBBTVFQUHVibGlzaGVyKHRoaXMuY29ubmVjdGlvbiwgbG9nZ2VyKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVyID0gbmV3IEFNUVBTdWJzY3JpYmVyKHRoaXMuY29ubmVjdGlvbiwgbG9nZ2VyKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJlcnJvclwiLCBlKTtcbiAgICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhc3luYyBwdWJsaXNoKHJvdXRpbmdLZXk6IHN0cmluZywgcGF5bG9hZDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgbG9nZ2VyKFxuICAgICAgJ1B1Ymxpc2hpbmcgbWVzc2FnZSB0byBleGNoYW5nZSBcIiVzXCIgZm9yIGtleSBcIiVzXCIgKCVqKScsXG4gICAgICB0aGlzLmV4Y2hhbmdlLFxuICAgICAgcm91dGluZ0tleSxcbiAgICAgIHBheWxvYWRcbiAgICApO1xuICAgIHJldHVybiB0aGlzLnB1Ymxpc2hlci5wdWJsaXNoKHRoaXMuZXhjaGFuZ2UsIHJvdXRpbmdLZXksIHBheWxvYWQpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHN1YnNjcmliZShcbiAgICByb3V0aW5nS2V5OiBzdHJpbmcsXG4gICAgb25NZXNzYWdlOiAobWVzc2FnZTogYW55KSA9PiB2b2lkXG4gICk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3QgaWQgPSB0aGlzLmN1cnJlbnRTdWJzY3JpcHRpb25JZCsrO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uTWFwW2lkXSA9IHtcbiAgICAgIHJvdXRpbmdLZXk6IHJvdXRpbmdLZXksXG4gICAgICBsaXN0ZW5lcjogb25NZXNzYWdlLFxuICAgIH07XG5cbiAgICBjb25zdCByZWZzID0gdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XTtcbiAgICBpZiAocmVmcyAmJiByZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IG5ld1JlZnMgPSBbLi4ucmVmcywgaWRdO1xuICAgICAgdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XSA9IG5ld1JlZnM7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGlkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlclxuICAgICAgICAuc3Vic2NyaWJlKHRoaXMucXVldWVfbmFtZSwgcm91dGluZ0tleSwgdGhpcy5vbk1lc3NhZ2UuYmluZCh0aGlzKSlcbiAgICAgICAgLnRoZW4oKGRpc3Bvc2VyKSA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XSA9IFtcbiAgICAgICAgICAgIC4uLih0aGlzLnN1YnNSZWZzTWFwW3JvdXRpbmdLZXldIHx8IFtdKSxcbiAgICAgICAgICAgIGlkLFxuICAgICAgICAgIF07XG4gICAgICAgICAgaWYgKHRoaXMudW5zdWJzY3JpYmVNYXBbcm91dGluZ0tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBkaXNwb3NlcigpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnVuc3Vic2NyaWJlTWFwW3JvdXRpbmdLZXldID0gZGlzcG9zZXI7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1bnN1YnNjcmliZShzdWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgcm91dGluZ0tleSA9IHRoaXMuc3Vic2NyaXB0aW9uTWFwW3N1YklkXS5yb3V0aW5nS2V5O1xuICAgIGNvbnN0IHJlZnMgPSB0aGlzLnN1YnNSZWZzTWFwW3JvdXRpbmdLZXldO1xuXG4gICAgaWYgKCFyZWZzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbiBvZiBpZCBcIiR7c3ViSWR9XCJgKTtcbiAgICB9XG5cbiAgICBpZiAocmVmcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnN1YnNjcmlwdGlvbk1hcFtzdWJJZF07XG4gICAgICByZXR1cm4gdGhpcy51bnN1YnNjcmliZUZvcktleShyb3V0aW5nS2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSByZWZzLmluZGV4T2Yoc3ViSWQpO1xuICAgICAgY29uc3QgbmV3UmVmcyA9XG4gICAgICAgIGluZGV4ID09PSAtMVxuICAgICAgICAgID8gcmVmc1xuICAgICAgICAgIDogWy4uLnJlZnMuc2xpY2UoMCwgaW5kZXgpLCAuLi5yZWZzLnNsaWNlKGluZGV4ICsgMSldO1xuICAgICAgdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XSA9IG5ld1JlZnM7XG4gICAgICBkZWxldGUgdGhpcy5zdWJzY3JpcHRpb25NYXBbc3ViSWRdO1xuICAgIH1cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmNJdGVyYXRvcjxUPih0cmlnZ2Vyczogc3RyaW5nIHwgc3RyaW5nW10pOiBBc3luY0l0ZXJhdG9yPFQ+IHtcbiAgICByZXR1cm4gbmV3IFB1YlN1YkFzeW5jSXRlcmF0b3I8VD4odGhpcywgdHJpZ2dlcnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1lc3NhZ2Uocm91dGluZ0tleTogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic1JlZnNNYXBbcm91dGluZ0tleV07XG5cbiAgICAvLyBEb24ndCB3b3JrIGZvciBub3RoaW5nLi5cbiAgICBpZiAoIXN1YnNjcmliZXJzIHx8ICFzdWJzY3JpYmVycy5sZW5ndGgpIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmVGb3JLZXkocm91dGluZ0tleSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzdWJJZCBvZiBzdWJzY3JpYmVycykge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25NYXBbc3ViSWRdLmxpc3RlbmVyKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgdW5zdWJzY3JpYmVGb3JLZXkocm91dGluZ0tleTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy51bnN1YnNjcmliZU1hcFtyb3V0aW5nS2V5XSgpO1xuICAgIGRlbGV0ZSB0aGlzLnN1YnNSZWZzTWFwW3JvdXRpbmdLZXldO1xuICAgIGRlbGV0ZSB0aGlzLnVuc3Vic2NyaWJlTWFwW3JvdXRpbmdLZXldO1xuICB9XG59XG4iXX0=