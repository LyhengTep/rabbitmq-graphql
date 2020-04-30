"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PubSubAsyncIterator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _iterall = require("iterall");

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * A class for digesting PubSubEngine events via the new AsyncIterator interface.
 * This implementation is a generic version of the one located at
 * https://github.com/apollographql/graphql-subscriptions/blob/master/src/event-emitter-to-async-iterator.ts
 * @class
 *
 * @constructor
 *
 * @property pullQueue @type {Function[]}
 * A queue of resolve functions waiting for an incoming event which has not yet arrived.
 * This queue expands as next() calls are made without PubSubEngine events occurring in between.
 *
 * @property pushQueue @type {any[]}
 * A queue of PubSubEngine events waiting for next() calls to be made.
 * This queue expands as PubSubEngine events arrice without next() calls occurring in between.
 *
 * @property eventsArray @type {string[]}
 * An array of PubSubEngine event names which this PubSubAsyncIterator should watch.
 *
 * @property allSubscribed @type {Promise<number[]>}
 * A promise of a list of all subscription ids to the passed PubSubEngine.
 *
 * @property listening @type {boolean}
 * Whether or not the PubSubAsynIterator is in listening mode (responding to incoming PubSubEngine events and next() calls).
 * Listening begins as true and turns to false once the return method is called.
 *
 * @property pubsub @type {PubSubEngine}
 * The PubSubEngine whose events will be observed.
 */
var PubSubAsyncIterator = /*#__PURE__*/function () {
  function PubSubAsyncIterator(pubsub, eventNames) {
    (0, _classCallCheck2["default"])(this, PubSubAsyncIterator);
    (0, _defineProperty2["default"])(this, "pullQueue", void 0);
    (0, _defineProperty2["default"])(this, "pushQueue", void 0);
    (0, _defineProperty2["default"])(this, "eventsArray", void 0);
    (0, _defineProperty2["default"])(this, "allSubscribed", void 0);
    (0, _defineProperty2["default"])(this, "listening", void 0);
    (0, _defineProperty2["default"])(this, "pubsub", void 0);
    this.pubsub = pubsub;
    this.pullQueue = [];
    this.pushQueue = [];
    this.listening = true;
    this.eventsArray = typeof eventNames === 'string' ? [eventNames] : eventNames;
    this.allSubscribed = this.subscribeAll();
  }

  (0, _createClass2["default"])(PubSubAsyncIterator, [{
    key: "next",
    value: function () {
      var _next = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.allSubscribed;

              case 2:
                return _context.abrupt("return", this.listening ? this.pullValue() : this["return"]());

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function next() {
        return _next.apply(this, arguments);
      }

      return next;
    }()
  }, {
    key: "return",
    value: function () {
      var _return2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.t0 = this;
                _context2.next = 3;
                return this.allSubscribed;

              case 3:
                _context2.t1 = _context2.sent;

                _context2.t0.emptyQueue.call(_context2.t0, _context2.t1);

                return _context2.abrupt("return", {
                  value: undefined,
                  done: true
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function _return() {
        return _return2.apply(this, arguments);
      }

      return _return;
    }()
  }, {
    key: "throw",
    value: function () {
      var _throw2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(err) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = this;
                _context3.next = 3;
                return this.allSubscribed;

              case 3:
                _context3.t1 = _context3.sent;

                _context3.t0.emptyQueue.call(_context3.t0, _context3.t1);

                return _context3.abrupt("return", Promise.reject(err));

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function _throw(_x) {
        return _throw2.apply(this, arguments);
      }

      return _throw;
    }()
  }, {
    key: _iterall.$$asyncIterator,
    value: function value() {
      return this;
    }
  }, {
    key: "pushValue",
    value: function () {
      var _pushValue = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(event) {
        var element;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.allSubscribed;

              case 2:
                if (this.pullQueue.length !== 0) {
                  element = this.pullQueue.shift();

                  if (element) {
                    element({
                      value: event,
                      done: false
                    });
                  }
                } else {
                  this.pushQueue.push(event);
                }

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function pushValue(_x2) {
        return _pushValue.apply(this, arguments);
      }

      return pushValue;
    }()
  }, {
    key: "pullValue",
    value: function pullValue() {
      var _this = this;

      return new Promise(function (resolve) {
        if (_this.pushQueue.length !== 0) {
          resolve({
            value: _this.pushQueue.shift(),
            done: false
          });
        } else {
          _this.pullQueue.push(resolve);
        }
      });
    }
  }, {
    key: "emptyQueue",
    value: function emptyQueue(subscriptionIds) {
      if (this.listening) {
        this.listening = false;
        this.unsubscribeAll(subscriptionIds);
        this.pullQueue.forEach(function (resolve) {
          return resolve({
            value: undefined,
            done: true
          });
        });
        this.pullQueue.length = 0;
        this.pushQueue.length = 0;
      }
    }
  }, {
    key: "subscribeAll",
    value: function subscribeAll() {
      var _this2 = this;

      return Promise.all(this.eventsArray.map(function (eventName) {
        return _this2.pubsub.subscribe(eventName, _this2.pushValue.bind(_this2), {});
      }));
    }
  }, {
    key: "unsubscribeAll",
    value: function unsubscribeAll(subscriptionIds) {
      var _iterator = _createForOfIteratorHelper(subscriptionIds),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var subscriptionId = _step.value;
          this.pubsub.unsubscribe(subscriptionId);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
  return PubSubAsyncIterator;
}();

exports.PubSubAsyncIterator = PubSubAsyncIterator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wdWJzdWItYXN5bmMtaXRlcmF0b3IudHMiXSwibmFtZXMiOlsiUHViU3ViQXN5bmNJdGVyYXRvciIsInB1YnN1YiIsImV2ZW50TmFtZXMiLCJwdWxsUXVldWUiLCJwdXNoUXVldWUiLCJsaXN0ZW5pbmciLCJldmVudHNBcnJheSIsImFsbFN1YnNjcmliZWQiLCJzdWJzY3JpYmVBbGwiLCJwdWxsVmFsdWUiLCJlbXB0eVF1ZXVlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJkb25lIiwiZXJyIiwiUHJvbWlzZSIsInJlamVjdCIsIiQkYXN5bmNJdGVyYXRvciIsImV2ZW50IiwibGVuZ3RoIiwiZWxlbWVudCIsInNoaWZ0IiwicHVzaCIsInJlc29sdmUiLCJzdWJzY3JpcHRpb25JZHMiLCJ1bnN1YnNjcmliZUFsbCIsImZvckVhY2giLCJhbGwiLCJtYXAiLCJldmVudE5hbWUiLCJzdWJzY3JpYmUiLCJwdXNoVmFsdWUiLCJiaW5kIiwic3Vic2NyaXB0aW9uSWQiLCJ1bnN1YnNjcmliZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTZCYUEsbUI7QUFTWCwrQkFBWUMsTUFBWixFQUFrQ0MsVUFBbEMsRUFBaUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUMvRCxTQUFLRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLRSxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixFQUFqQjtBQUNBLFNBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLE9BQU9KLFVBQVAsS0FBc0IsUUFBdEIsR0FBaUMsQ0FBQ0EsVUFBRCxDQUFqQyxHQUFnREEsVUFBbkU7QUFDQSxTQUFLSyxhQUFMLEdBQXFCLEtBQUtDLFlBQUwsRUFBckI7QUFDRDs7Ozs7Ozs7Ozs7dUJBR08sS0FBS0QsYTs7O2lEQUNKLEtB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bXBvcnQgeyBQdWJTdWJFbmdpbmUgfSBmcm9tICdncmFwaHFsLXN1YnNjcmlwdGlvbnMnO1xuXG4vKipcbiAqIEEgY2xhc3MgZm9yIGRpZ2VzdGluZyBQdWJTdWJFbmdpbmUgZXZlbnRzIHZpYSB0aGUgbmV3IEFzeW5jSXRlcmF0b3IgaW50ZXJmYWNlLlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBhIGdlbmVyaWMgdmVyc2lvbiBvZiB0aGUgb25lIGxvY2F0ZWQgYXRcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hcG9sbG9ncmFwaHFsL2dyYXBocWwtc3Vic2NyaXB0aW9ucy9ibG9iL21hc3Rlci9zcmMvZXZlbnQtZW1pdHRlci10by1hc3luYy1pdGVyYXRvci50c1xuICogQGNsYXNzXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKlxuICogQHByb3BlcnR5IHB1bGxRdWV1ZSBAdHlwZSB7RnVuY3Rpb25bXX1cbiAqIEEgcXVldWUgb2YgcmVzb2x2ZSBmdW5jdGlvbnMgd2FpdGluZyBmb3IgYW4gaW5jb21pbmcgZXZlbnQgd2hpY2ggaGFzIG5vdCB5ZXQgYXJyaXZlZC5cbiAqIFRoaXMgcXVldWUgZXhwYW5kcyBhcyBuZXh0KCkgY2FsbHMgYXJlIG1hZGUgd2l0aG91dCBQdWJTdWJFbmdpbmUgZXZlbnRzIG9jY3VycmluZyBpbiBiZXR3ZWVuLlxuICpcbiAqIEBwcm9wZXJ0eSBwdXNoUXVldWUgQHR5cGUge2FueVtdfVxuICogQSBxdWV1ZSBvZiBQdWJTdWJFbmdpbmUgZXZlbnRzIHdhaXRpbmcgZm9yIG5leHQoKSBjYWxscyB0byBiZSBtYWRlLlxuICogVGhpcyBxdWV1ZSBleHBhbmRzIGFzIFB1YlN1YkVuZ2luZSBldmVudHMgYXJyaWNlIHdpdGhvdXQgbmV4dCgpIGNhbGxzIG9jY3VycmluZyBpbiBiZXR3ZWVuLlxuICpcbiAqIEBwcm9wZXJ0eSBldmVudHNBcnJheSBAdHlwZSB7c3RyaW5nW119XG4gKiBBbiBhcnJheSBvZiBQdWJTdWJFbmdpbmUgZXZlbnQgbmFtZXMgd2hpY2ggdGhpcyBQdWJTdWJBc3luY0l0ZXJhdG9yIHNob3VsZCB3YXRjaC5cbiAqXG4gKiBAcHJvcGVydHkgYWxsU3Vic2NyaWJlZCBAdHlwZSB7UHJvbWlzZTxudW1iZXJbXT59XG4gKiBBIHByb21pc2Ugb2YgYSBsaXN0IG9mIGFsbCBzdWJzY3JpcHRpb24gaWRzIHRvIHRoZSBwYXNzZWQgUHViU3ViRW5naW5lLlxuICpcbiAqIEBwcm9wZXJ0eSBsaXN0ZW5pbmcgQHR5cGUge2Jvb2xlYW59XG4gKiBXaGV0aGVyIG9yIG5vdCB0aGUgUHViU3ViQXN5bkl0ZXJhdG9yIGlzIGluIGxpc3RlbmluZyBtb2RlIChyZXNwb25kaW5nIHRvIGluY29taW5nIFB1YlN1YkVuZ2luZSBldmVudHMgYW5kIG5leHQoKSBjYWxscykuXG4gKiBMaXN0ZW5pbmcgYmVnaW5zIGFzIHRydWUgYW5kIHR1cm5zIHRvIGZhbHNlIG9uY2UgdGhlIHJldHVybiBtZXRob2QgaXMgY2FsbGVkLlxuICpcbiAqIEBwcm9wZXJ0eSBwdWJzdWIgQHR5cGUge1B1YlN1YkVuZ2luZX1cbiAqIFRoZSBQdWJTdWJFbmdpbmUgd2hvc2UgZXZlbnRzIHdpbGwgYmUgb2JzZXJ2ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBQdWJTdWJBc3luY0l0ZXJhdG9yPFQ+IGltcGxlbWVudHMgQXN5bmNJdGVyYXRvcjxUPiB7XG5cbiAgcHJpdmF0ZSBwdWxsUXVldWU6IEZ1bmN0aW9uW107XG4gIHByaXZhdGUgcHVzaFF1ZXVlOiBhbnlbXTtcbiAgcHJpdmF0ZSBldmVudHNBcnJheTogc3RyaW5nW107XG4gIHByaXZhdGUgYWxsU3Vic2NyaWJlZDogUHJvbWlzZTxudW1iZXJbXT47XG4gIHByaXZhdGUgbGlzdGVuaW5nOiBib29sZWFuO1xuICBwcml2YXRlIHB1YnN1YjogUHViU3ViRW5naW5lO1xuXG4gIGNvbnN0cnVjdG9yKHB1YnN1YjogUHViU3ViRW5naW5lLCBldmVudE5hbWVzOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIHRoaXMucHVic3ViID0gcHVic3ViO1xuICAgIHRoaXMucHVsbFF1ZXVlID0gW107XG4gICAgdGhpcy5wdXNoUXVldWUgPSBbXTtcbiAgICB0aGlzLmxpc3RlbmluZyA9IHRydWU7XG4gICAgdGhpcy5ldmVudHNBcnJheSA9IHR5cGVvZiBldmVudE5hbWVzID09PSAnc3RyaW5nJyA/IFtldmVudE5hbWVzXSA6IGV2ZW50TmFtZXM7XG4gICAgdGhpcy5hbGxTdWJzY3JpYmVkID0gdGhpcy5zdWJzY3JpYmVBbGwoKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBuZXh0KCkge1xuICAgIGF3YWl0IHRoaXMuYWxsU3Vic2NyaWJlZDtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5pbmcgPyB0aGlzLnB1bGxWYWx1ZSgpIDogdGhpcy5yZXR1cm4oKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXR1cm4oKTogUHJvbWlzZTxJdGVyYXRvclJlc3VsdDxhbnk+PiB7XG4gICAgdGhpcy5lbXB0eVF1ZXVlKGF3YWl0IHRoaXMuYWxsU3Vic2NyaWJlZCk7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHRocm93KGVycjogYW55KSB7XG4gICAgdGhpcy5lbXB0eVF1ZXVlKGF3YWl0IHRoaXMuYWxsU3Vic2NyaWJlZCk7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gIH1cblxuICBwdWJsaWMgWyQkYXN5bmNJdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHB1c2hWYWx1ZShldmVudDogYW55KSB7XG4gICAgYXdhaXQgdGhpcy5hbGxTdWJzY3JpYmVkO1xuICAgIGlmICh0aGlzLnB1bGxRdWV1ZS5sZW5ndGggIT09IDApIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5wdWxsUXVldWUuc2hpZnQoKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQoeyB2YWx1ZTogZXZlbnQsIGRvbmU6IGZhbHNlIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1c2hRdWV1ZS5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHB1bGxWYWx1ZSgpOiBQcm9taXNlPEl0ZXJhdG9yUmVzdWx0PGFueT4+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAodGhpcy5wdXNoUXVldWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJlc29sdmUoeyB2YWx1ZTogdGhpcy5wdXNoUXVldWUuc2hpZnQoKSwgZG9uZTogZmFsc2UgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnB1bGxRdWV1ZS5wdXNoKHJlc29sdmUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbXB0eVF1ZXVlKHN1YnNjcmlwdGlvbklkczogbnVtYmVyW10pIHtcbiAgICBpZiAodGhpcy5saXN0ZW5pbmcpIHtcbiAgICAgIHRoaXMubGlzdGVuaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlQWxsKHN1YnNjcmlwdGlvbklkcyk7XG4gICAgICB0aGlzLnB1bGxRdWV1ZS5mb3JFYWNoKHJlc29sdmUgPT4gcmVzb2x2ZSh7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSkpO1xuICAgICAgdGhpcy5wdWxsUXVldWUubGVuZ3RoID0gMDtcbiAgICAgIHRoaXMucHVzaFF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVBbGwoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHRoaXMuZXZlbnRzQXJyYXkubWFwKFxuICAgICAgZXZlbnROYW1lID0+IHRoaXMucHVic3ViLnN1YnNjcmliZShldmVudE5hbWUsIHRoaXMucHVzaFZhbHVlLmJpbmQodGhpcyksIHt9KSxcbiAgICApKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVBbGwoc3Vic2NyaXB0aW9uSWRzOiBudW1iZXJbXSkge1xuICAgIGZvciAoY29uc3Qgc3Vic2NyaXB0aW9uSWQgb2Ygc3Vic2NyaXB0aW9uSWRzKSB7XG4gICAgICB0aGlzLnB1YnN1Yi51bnN1YnNjcmliZShzdWJzY3JpcHRpb25JZCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==