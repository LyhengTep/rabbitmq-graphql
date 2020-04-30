"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMQPPublisher = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var AMQPPublisher = /*#__PURE__*/function () {
  function AMQPPublisher(connection, logger) {
    (0, _classCallCheck2["default"])(this, AMQPPublisher);
    this.connection = connection;
    this.logger = logger;
    (0, _defineProperty2["default"])(this, "channel", null);
  }

  (0, _createClass2["default"])(AMQPPublisher, [{
    key: "publish",
    value: function () {
      var _publish = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(exchange, routingKey, data) {
        var _this = this;

        var promise;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.channel) {
                  promise = Promise.resolve(this.channel);
                } else {
                  promise = this.connection.createChannel();
                }

                return _context2.abrupt("return", promise.then( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(ch) {
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _this.channel = ch;
                            return _context.abrupt("return", ch.assertExchange(exchange, 'topic', {
                              durable: false,
                              autoDelete: false
                            }).then(function () {
                              _this.logger('Message sent to Exchange "%s" with Routing Key "%s" (%j)', exchange, routingKey, data);

                              ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
                              return Promise.resolve();
                            })["catch"](function (err) {
                              return Promise.reject(err);
                            }));

                          case 2:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function publish(_x, _x2, _x3) {
        return _publish.apply(this, arguments);
      }

      return publish;
    }()
  }]);
  return AMQPPublisher;
}();

exports.AMQPPublisher = AMQPPublisher;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbXFwL3B1Ymxpc2hlci50cyJdLCJuYW1lcyI6WyJBTVFQUHVibGlzaGVyIiwiY29ubmVjdGlvbiIsImxvZ2dlciIsImV4Y2hhbmdlIiwicm91dGluZ0tleSIsImRhdGEiLCJjaGFubmVsIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiY3JlYXRlQ2hhbm5lbCIsInRoZW4iLCJjaCIsImFzc2VydEV4Y2hhbmdlIiwiZHVyYWJsZSIsImF1dG9EZWxldGUiLCJwdWJsaXNoIiwiQnVmZmVyIiwiZnJvbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnIiLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHYUEsYTtBQUlYLHlCQUNVQyxVQURWLEVBRVVDLE1BRlYsRUFHRTtBQUFBO0FBQUEsU0FGUUQsVUFFUixHQUZRQSxVQUVSO0FBQUEsU0FEUUMsTUFDUixHQURRQSxNQUNSO0FBQUEsc0RBTHFDLElBS3JDO0FBRUQ7Ozs7O3FIQUVvQkMsUSxFQUFrQkMsVSxFQUFvQkMsSTs7Ozs7Ozs7QUFFekQsb0JBQUksS0FBS0MsT0FBVCxFQUFrQjtBQUNoQkMsa0JBQUFBLE9BQU8sR0FBR0MsT0FBTyxDQUFDQyxPQUFSLENBQWdCLEtBQUtILE9BQXJCLENBQVY7QUFDRCxpQkFGRCxNQUVPO0FBQ0xDLGtCQUFBQSxPQUFPLEdBQUcsS0FBS04sVUFBTCxDQUFnQlMsYUFBaEIsRUFBVjtBQUNEOztrREFDTUgsT0FBTyxDQUNiSSxJQURNO0FBQUEsMkdBQ0QsaUJBQU1DLEVBQU47QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNKLDRCQUFBLEtBQUksQ0FBQ04sT0FBTCxHQUFlTSxFQUFmO0FBREksNkRBRUdBLEVBQUUsQ0FBQ0MsY0FBSCxDQUFrQlYsUUFBbEIsRUFBNEIsT0FBNUIsRUFBcUM7QUFBRVcsOEJBQUFBLE9BQU8sRUFBRSxLQUFYO0FBQWtCQyw4QkFBQUEsVUFBVSxFQUFFO0FBQTlCLDZCQUFyQyxFQUNOSixJQURNLENBQ0QsWUFBTTtBQUNWLDhCQUFBLEtBQUksQ0FBQ1QsTUFBTCxDQUFZLDBEQUFaLEVBQXdFQyxRQUF4RSxFQUFrRkMsVUFBbEYsRUFBOEZDLElBQTlGOztBQUNBTyw4QkFBQUEsRUFBRSxDQUFDSSxPQUFILENBQVdiLFFBQVgsRUFBcUJDLFVBQXJCLEVBQWlDYSxNQUFNLENBQUNDLElBQVAsQ0FBWUMsSUFBSSxDQUFDQyxTQUFMLENBQWVmLElBQWYsQ0FBWixDQUFqQztBQUNBLHFDQUFPRyxPQUFPLENBQUNDLE9BQVIsRUFBUDtBQUNELDZCQUxNLFdBTUEsVUFBQVksR0FBRyxFQUFJO0FBQ1oscUNBQU9iLE9BQU8sQ0FBQ2MsTUFBUixDQUFlRCxHQUFmLENBQVA7QUFDRCw2QkFSTSxDQUZIOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURDOztBQUFBO0FBQUE7QUFBQTtBQUFBLG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFtcXAgZnJvbSAnYW1xcGxpYic7XG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnO1xuXG5leHBvcnQgY2xhc3MgQU1RUFB1Ymxpc2hlciB7XG5cbiAgcHJpdmF0ZSBjaGFubmVsOiBhbXFwLkNoYW5uZWwgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNvbm5lY3Rpb246IGFtcXAuQ29ubmVjdGlvbixcbiAgICBwcml2YXRlIGxvZ2dlcjogRGVidWcuSURlYnVnZ2VyXG4gICkge1xuXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcHVibGlzaChleGNoYW5nZTogc3RyaW5nLCByb3V0aW5nS2V5OiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBwcm9taXNlOiBQcm9taXNlTGlrZTxhbXFwLkNoYW5uZWw+O1xuICAgIGlmICh0aGlzLmNoYW5uZWwpIHtcbiAgICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodGhpcy5jaGFubmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZSA9IHRoaXMuY29ubmVjdGlvbi5jcmVhdGVDaGFubmVsKCk7XG4gICAgfVxuICAgIHJldHVybiBwcm9taXNlXG4gICAgLnRoZW4oYXN5bmMgY2ggPT4ge1xuICAgICAgdGhpcy5jaGFubmVsID0gY2g7XG4gICAgICByZXR1cm4gY2guYXNzZXJ0RXhjaGFuZ2UoZXhjaGFuZ2UsICd0b3BpYycsIHsgZHVyYWJsZTogZmFsc2UsIGF1dG9EZWxldGU6IGZhbHNlIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMubG9nZ2VyKCdNZXNzYWdlIHNlbnQgdG8gRXhjaGFuZ2UgXCIlc1wiIHdpdGggUm91dGluZyBLZXkgXCIlc1wiICglaiknLCBleGNoYW5nZSwgcm91dGluZ0tleSwgZGF0YSk7XG4gICAgICAgIGNoLnB1Ymxpc2goZXhjaGFuZ2UsIHJvdXRpbmdLZXksIEJ1ZmZlci5mcm9tKEpTT04uc3RyaW5naWZ5KGRhdGEpKSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19