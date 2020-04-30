"use strict";

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

var _debug = _interopRequireDefault(require("debug"));

var _publisher = require("./amqp/publisher");

var _subscriber = require("./amqp/subscriber");

var _pubsubAsyncIterator = require("./pubsub-async-iterator");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var logger = (0, _debug["default"])("AMQPPubSub");

var AMQPPubSub = /*#__PURE__*/function () {
  function AMQPPubSub(options) {
    var queue_name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "graphql_queue";
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
    this.connection = options.connection;
    this.exchange = options.exchange || "graphql_subscriptions";
    this.queue_name = queue_name;
    this.subscriptionMap = {};
    this.subsRefsMap = {};
    this.unsubscribeMap = {};
    this.currentSubscriptionId = 0; // Initialize AMQP Helper

    this.publisher = new _publisher.AMQPPublisher(this.connection, logger);
    this.subscriber = new _subscriber.AMQPSubscriber(this.connection, logger);
    logger("Finished initializing");
  }

  (0, _createClass2["default"])(AMQPPubSub, [{
    key: "publish",
    value: function () {
      var _publish = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(routingKey, payload) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                logger('Publishing message to exchange "%s" for key "%s" (%j)', this.exchange, routingKey, payload);
                return _context.abrupt("return", this.publisher.publish(this.exchange, routingKey, payload));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function publish(_x, _x2) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
  }, {
    key: "subscribe",
    value: function () {
      var _subscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(routingKey, onMessage) {
        var _this = this;

        var id, refs, newRefs;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                id = this.currentSubscriptionId++;
                this.subscriptionMap[id] = {
                  routingKey: routingKey,
                  listener: onMessage
                };
                refs = this.subsRefsMap[routingKey];

                if (!(refs && refs.length > 0)) {
                  _context2.next = 9;
                  break;
                }

                newRefs = [].concat((0, _toConsumableArray2["default"])(refs), [id]);
                this.subsRefsMap[routingKey] = newRefs;
                return _context2.abrupt("return", Promise.resolve(id));

              case 9:
                return _context2.abrupt("return", this.subscriber.subscribe(this.queue_name, routingKey, this.onMessage.bind(this)).then(function (disposer) {
                  _this.subsRefsMap[routingKey] = [].concat((0, _toConsumableArray2["default"])(_this.subsRefsMap[routingKey] || []), [id]);

                  if (_this.unsubscribeMap[routingKey]) {
                    return disposer();
                  }

                  _this.unsubscribeMap[routingKey] = disposer;
                  return Promise.resolve(id);
                }));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribe(_x3, _x4) {
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
      var _unsubscribeForKey = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(routingKey) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.unsubscribeMap[routingKey]();

              case 2:
                delete this.subsRefsMap[routingKey];
                delete this.unsubscribeMap[routingKey];

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribeForKey(_x5) {
        return _unsubscribeForKey.apply(this, arguments);
      }

      return unsubscribeForKey;
    }()
  }]);
  return AMQPPubSub;
}();

exports.AMQPPubSub = AMQPPubSub;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wdWJzdWIudHMiXSwibmFtZXMiOlsibG9nZ2VyIiwiQU1RUFB1YlN1YiIsIm9wdGlvbnMiLCJxdWV1ZV9uYW1lIiwiY29ubmVjdGlvbiIsImV4Y2hhbmdlIiwic3Vic2NyaXB0aW9uTWFwIiwic3Vic1JlZnNNYXAiLCJ1bnN1YnNjcmliZU1hcCIsImN1cnJlbnRTdWJzY3JpcHRpb25JZCIsInB1Ymxpc2hlciIsIkFNUVBQdWJsaXNoZXIiLCJzdWJzY3JpYmVyIiwiQU1RUFN1YnNjcmliZXIiLCJyb3V0aW5nS2V5IiwicGF5bG9hZCIsInB1Ymxpc2giLCJvbk1lc3NhZ2UiLCJpZCIsImxpc3RlbmVyIiwicmVmcyIsImxlbmd0aCIsIm5ld1JlZnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInN1YnNjcmliZSIsImJpbmQiLCJ0aGVuIiwiZGlzcG9zZXIiLCJzdWJJZCIsIkVycm9yIiwidW5zdWJzY3JpYmVGb3JLZXkiLCJpbmRleCIsImluZGV4T2YiLCJzbGljZSIsInRyaWdnZXJzIiwiUHViU3ViQXN5bmNJdGVyYXRvciIsIm1lc3NhZ2UiLCJzdWJzY3JpYmVycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxHQUFHLHVCQUFNLFlBQU4sQ0FBZjs7SUFFYUMsVTtBQWNYLHNCQUNFQyxPQURGLEVBR0U7QUFBQSxRQURBQyxVQUNBLHVFQURxQixlQUNyQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQSxTQUFLQyxVQUFMLEdBQWtCRixPQUFPLENBQUNFLFVBQTFCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQkgsT0FBTyxDQUFDRyxRQUFSLElBQW9CLHVCQUFwQztBQUVBLFNBQUtGLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0csZUFBTCxHQUF1QixFQUF2QjtBQUNBLFNBQUtDLFdBQUwsR0FB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QUFHLENBQW5CLENBRmpDLEVBREY7QUFJQSxhQUFLekIsV0FBTCxDQUFpQk8sVUFBakIsSUFBK0JRLE9BQS9CO0FBQ0EsZUFBTyxLQUFLaEIsZUFBTCxDQUFxQnVCLEtBQXJCLENBQVA7QUFDRDs7QUFDRCxhQUFPTixPQUFPLENBQUNDLE9BQVIsRUFBUDtBQUNEOzs7a0NBRXVCVyxRLEVBQStDO0FBQ3JFLGFBQU8sSUFBSUMsd0NBQUosQ0FBMkIsSUFBM0IsRUFBaUNELFFBQWpDLENBQVA7QUFDRDs7OzhCQUVpQnJCLFUsRUFBb0J1QixPLEVBQW9CO0FBQ3hELFVBQU1DLFdBQVcsR0FBRyxLQUFLL0IsV0FBTCxDQUFpQk8sVUFBakIsQ0FBcEIsQ0FEd0QsQ0FHeEQ7O0FBQ0EsVUFBSSxDQUFDd0IsV0FBRCxJQUFnQixDQUFDQSxXQUFXLENBQUNqQixNQUFqQyxFQUF5QztBQUN2QyxhQUFLVSxpQkFBTCxDQUF1QmpCLFVBQXZCO0FBQ0E7QUFDRDs7QUFQdUQsaURBU3BDd0IsV0FUb0M7QUFBQTs7QUFBQTtBQVN4RCw0REFBaUM7QUFBQSxjQUF0QlQsTUFBc0I7O0FBQy9CLGVBQUt2QixlQUFMLENBQXFCdUIsTUFBckIsRUFBNEJWLFFBQTVCLENBQXFDa0IsT0FBckM7QUFDRDtBQVh1RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWXpEOzs7OytIQUUrQnZCLFU7Ozs7Ozt1QkFDeEIsS0FBS04sY0FBTCxDQUFvQk0sVUFBcEIsRzs7O0FBQ04sdUJBQU8sS0FBS1AsV0FBTCxDQUFpQk8sVUFBakIsQ0FBUDtBQUNBLHVCQUFPLEtBQUtOLGNBQUwsQ0FBb0JNLFVBQXBCLENBQVAiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQdWJTdWJFbmdpbmUgfSBmcm9tIFwiZ3JhcGhxbC1zdWJzY3JpcHRpb25zXCI7XG5pbXBvcnQgKiBhcyBhbXFwIGZyb20gXCJhbXFwbGliXCI7XG5pbXBvcnQgRGVidWcgZnJvbSBcImRlYnVnXCI7XG5cbmltcG9ydCB7IFB1YlN1YkFNUVBPcHRpb25zIH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgQU1RUFB1Ymxpc2hlciB9IGZyb20gXCIuL2FtcXAvcHVibGlzaGVyXCI7XG5pbXBvcnQgeyBBTVFQU3Vic2NyaWJlciB9IGZyb20gXCIuL2FtcXAvc3Vic2NyaWJlclwiO1xuaW1wb3J0IHsgUHViU3ViQXN5bmNJdGVyYXRvciB9IGZyb20gXCIuL3B1YnN1Yi1hc3luYy1pdGVyYXRvclwiO1xuXG5jb25zdCBsb2dnZXIgPSBEZWJ1ZyhcIkFNUVBQdWJTdWJcIik7XG5cbmV4cG9ydCBjbGFzcyBBTVFQUHViU3ViIGltcGxlbWVudHMgUHViU3ViRW5naW5lIHtcbiAgcHJpdmF0ZSBjb25uZWN0aW9uOiBhbXFwLkNvbm5lY3Rpb247XG4gIHByaXZhdGUgZXhjaGFuZ2U6IHN0cmluZztcbiAgcHJpdmF0ZSBxdWV1ZV9uYW1lOiBzdHJpbmc7XG4gIHByaXZhdGUgcHVibGlzaGVyOiBBTVFQUHVibGlzaGVyO1xuICBwcml2YXRlIHN1YnNjcmliZXI6IEFNUVBTdWJzY3JpYmVyO1xuXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uTWFwOiB7XG4gICAgW3N1YklkOiBudW1iZXJdOiB7IHJvdXRpbmdLZXk6IHN0cmluZzsgbGlzdGVuZXI6IEZ1bmN0aW9uIH07XG4gIH07XG4gIHByaXZhdGUgc3Vic1JlZnNNYXA6IHsgW3RyaWdnZXI6IHN0cmluZ106IEFycmF5PG51bWJlcj4gfTtcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZU1hcDogeyBbdHJpZ2dlcjogc3RyaW5nXTogKCkgPT4gUHJvbWlzZUxpa2U8YW55PiB9O1xuICBwcml2YXRlIGN1cnJlbnRTdWJzY3JpcHRpb25JZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG9wdGlvbnM6IFB1YlN1YkFNUVBPcHRpb25zLFxuICAgIHF1ZXVlX25hbWU6IHN0cmluZyA9IFwiZ3JhcGhxbF9xdWV1ZVwiXG4gICkge1xuICAgIC8vIFNldHVwIFZhcmlhYmxlc1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IG9wdGlvbnMuY29ubmVjdGlvbjtcbiAgICB0aGlzLmV4Y2hhbmdlID0gb3B0aW9ucy5leGNoYW5nZSB8fCBcImdyYXBocWxfc3Vic2NyaXB0aW9uc1wiO1xuXG4gICAgdGhpcy5xdWV1ZV9uYW1lID0gcXVldWVfbmFtZTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbk1hcCA9IHt9O1xuICAgIHRoaXMuc3Vic1JlZnNNYXAgPSB7fTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlTWFwID0ge307XG4gICAgdGhpcy5jdXJyZW50U3Vic2NyaXB0aW9uSWQgPSAwO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBBTVFQIEhlbHBlclxuICAgIHRoaXMucHVibGlzaGVyID0gbmV3IEFNUVBQdWJsaXNoZXIodGhpcy5jb25uZWN0aW9uLCBsb2dnZXIpO1xuICAgIHRoaXMuc3Vic2NyaWJlciA9IG5ldyBBTVFQU3Vic2NyaWJlcih0aGlzLmNvbm5lY3Rpb24sIGxvZ2dlcik7XG5cbiAgICBsb2dnZXIoXCJGaW5pc2hlZCBpbml0aWFsaXppbmdcIik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcHVibGlzaChyb3V0aW5nS2V5OiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxvZ2dlcihcbiAgICAgICdQdWJsaXNoaW5nIG1lc3NhZ2UgdG8gZXhjaGFuZ2UgXCIlc1wiIGZvciBrZXkgXCIlc1wiICglaiknLFxuICAgICAgdGhpcy5leGNoYW5nZSxcbiAgICAgIHJvdXRpbmdLZXksXG4gICAgICBwYXlsb2FkXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5wdWJsaXNoZXIucHVibGlzaCh0aGlzLmV4Y2hhbmdlLCByb3V0aW5nS2V5LCBwYXlsb2FkKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzdWJzY3JpYmUoXG4gICAgcm91dGluZ0tleTogc3RyaW5nLFxuICAgIG9uTWVzc2FnZTogKG1lc3NhZ2U6IGFueSkgPT4gdm9pZFxuICApOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIGNvbnN0IGlkID0gdGhpcy5jdXJyZW50U3Vic2NyaXB0aW9uSWQrKztcbiAgICB0aGlzLnN1YnNjcmlwdGlvbk1hcFtpZF0gPSB7XG4gICAgICByb3V0aW5nS2V5OiByb3V0aW5nS2V5LFxuICAgICAgbGlzdGVuZXI6IG9uTWVzc2FnZSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVmcyA9IHRoaXMuc3Vic1JlZnNNYXBbcm91dGluZ0tleV07XG4gICAgaWYgKHJlZnMgJiYgcmVmcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBuZXdSZWZzID0gWy4uLnJlZnMsIGlkXTtcbiAgICAgIHRoaXMuc3Vic1JlZnNNYXBbcm91dGluZ0tleV0gPSBuZXdSZWZzO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnN1YnNjcmliZXJcbiAgICAgICAgLnN1YnNjcmliZSh0aGlzLnF1ZXVlX25hbWUsIHJvdXRpbmdLZXksIHRoaXMub25NZXNzYWdlLmJpbmQodGhpcykpXG4gICAgICAgIC50aGVuKChkaXNwb3NlcikgPT4ge1xuICAgICAgICAgIHRoaXMuc3Vic1JlZnNNYXBbcm91dGluZ0tleV0gPSBbXG4gICAgICAgICAgICAuLi4odGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XSB8fCBbXSksXG4gICAgICAgICAgICBpZCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh0aGlzLnVuc3Vic2NyaWJlTWFwW3JvdXRpbmdLZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZGlzcG9zZXIoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy51bnN1YnNjcmliZU1hcFtyb3V0aW5nS2V5XSA9IGRpc3Bvc2VyO1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaWQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdW5zdWJzY3JpYmUoc3ViSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHJvdXRpbmdLZXkgPSB0aGlzLnN1YnNjcmlwdGlvbk1hcFtzdWJJZF0ucm91dGluZ0tleTtcbiAgICBjb25zdCByZWZzID0gdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XTtcblxuICAgIGlmICghcmVmcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBubyBzdWJzY3JpcHRpb24gb2YgaWQgXCIke3N1YklkfVwiYCk7XG4gICAgfVxuXG4gICAgaWYgKHJlZnMubGVuZ3RoID09PSAxKSB7XG4gICAgICBkZWxldGUgdGhpcy5zdWJzY3JpcHRpb25NYXBbc3ViSWRdO1xuICAgICAgcmV0dXJuIHRoaXMudW5zdWJzY3JpYmVGb3JLZXkocm91dGluZ0tleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gcmVmcy5pbmRleE9mKHN1YklkKTtcbiAgICAgIGNvbnN0IG5ld1JlZnMgPVxuICAgICAgICBpbmRleCA9PT0gLTFcbiAgICAgICAgICA/IHJlZnNcbiAgICAgICAgICA6IFsuLi5yZWZzLnNsaWNlKDAsIGluZGV4KSwgLi4ucmVmcy5zbGljZShpbmRleCArIDEpXTtcbiAgICAgIHRoaXMuc3Vic1JlZnNNYXBbcm91dGluZ0tleV0gPSBuZXdSZWZzO1xuICAgICAgZGVsZXRlIHRoaXMuc3Vic2NyaXB0aW9uTWFwW3N1YklkXTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jSXRlcmF0b3I8VD4odHJpZ2dlcnM6IHN0cmluZyB8IHN0cmluZ1tdKTogQXN5bmNJdGVyYXRvcjxUPiB7XG4gICAgcmV0dXJuIG5ldyBQdWJTdWJBc3luY0l0ZXJhdG9yPFQ+KHRoaXMsIHRyaWdnZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgb25NZXNzYWdlKHJvdXRpbmdLZXk6IHN0cmluZywgbWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgY29uc3Qgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNSZWZzTWFwW3JvdXRpbmdLZXldO1xuXG4gICAgLy8gRG9uJ3Qgd29yayBmb3Igbm90aGluZy4uXG4gICAgaWYgKCFzdWJzY3JpYmVycyB8fCAhc3Vic2NyaWJlcnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRm9yS2V5KHJvdXRpbmdLZXkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoY29uc3Qgc3ViSWQgb2Ygc3Vic2NyaWJlcnMpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uTWFwW3N1YklkXS5saXN0ZW5lcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHVuc3Vic2NyaWJlRm9yS2V5KHJvdXRpbmdLZXk6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMudW5zdWJzY3JpYmVNYXBbcm91dGluZ0tleV0oKTtcbiAgICBkZWxldGUgdGhpcy5zdWJzUmVmc01hcFtyb3V0aW5nS2V5XTtcbiAgICBkZWxldGUgdGhpcy51bnN1YnNjcmliZU1hcFtyb3V0aW5nS2V5XTtcbiAgfVxufVxuIl19