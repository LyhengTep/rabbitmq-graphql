"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMQPSubscriber = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _common = require("./common");

var AMQPSubscriber = /*#__PURE__*/function () {
  function AMQPSubscriber(connection, logger) {
    (0, _classCallCheck2["default"])(this, AMQPSubscriber);
    this.connection = connection;
    this.logger = logger;
    (0, _defineProperty2["default"])(this, "channel", null);
  }

  (0, _createClass2["default"])(AMQPSubscriber, [{
    key: "subscribe",
    value: function () {
      var _subscribe = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(queue_name, routingKey, action) {
        var _this = this;

        var promise;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.channel) {
                  promise = Promise.resolve(this.channel);
                } else {
                  promise = this.connection.createChannel();
                }

                return _context3.abrupt("return", promise.then( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(ch) {
                    return _regenerator["default"].wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _this.channel = ch;
                            return _context2.abrupt("return", ch.assertQueue(queue_name || "graphql_queue").then( /*#__PURE__*/function () {
                              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(queue) {
                                return _regenerator["default"].wrap(function _callee$(_context) {
                                  while (1) {
                                    switch (_context.prev = _context.next) {
                                      case 0:
                                        return _context.abrupt("return", ch.consume(queue.queue, function (msg) {
                                          var parsedMessage = _common.Logger.convertMessage(msg);

                                          _this.logger('Message arrived from Queue "%s" (%j)', queue.queue, parsedMessage);

                                          action(routingKey, parsedMessage);
                                        }, {
                                          noAck: true
                                        }).then(function (opts) {
                                          _this.logger('Subscribed to Queue "%s" (%s)', queue.queue, opts.consumerTag);

                                          return function () {
                                            _this.logger('Disposing Subscriber to Queue "%s" (%s)', queue.queue, opts.consumerTag);

                                            return ch.cancel(opts.consumerTag);
                                          };
                                        }));

                                      case 1:
                                      case "end":
                                        return _context.stop();
                                    }
                                  }
                                }, _callee);
                              }));

                              return function (_x5) {
                                return _ref2.apply(this, arguments);
                              };
                            }())["catch"](function (err) {
                              return Promise.reject(err);
                            }));

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function subscribe(_x, _x2, _x3) {
        return _subscribe.apply(this, arguments);
      }

      return subscribe;
    }()
  }]);
  return AMQPSubscriber;
}();

exports.AMQPSubscriber = AMQPSubscriber;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbXFwL3N1YnNjcmliZXIudHMiXSwibmFtZXMiOlsiQU1RUFN1YnNjcmliZXIiLCJjb25uZWN0aW9uIiwibG9nZ2VyIiwicXVldWVfbmFtZSIsInJvdXRpbmdLZXkiLCJhY3Rpb24iLCJjaGFubmVsIiwicHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwiY3JlYXRlQ2hhbm5lbCIsInRoZW4iLCJjaCIsImFzc2VydFF1ZXVlIiwicXVldWUiLCJjb25zdW1lIiwibXNnIiwicGFyc2VkTWVzc2FnZSIsIkxvZ2dlciIsImNvbnZlcnRNZXNzYWdlIiwibm9BY2siLCJvcHRzIiwiY29uc3VtZXJUYWciLCJjYW5jZWwiLCJlcnIiLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7SUFFYUEsYztBQUdYLDBCQUNVQyxVQURWLEVBRVVDLE1BRlYsRUFHRTtBQUFBO0FBQUEsU0FGUUQsVUFFUixHQUZRQSxVQUVSO0FBQUEsU0FEUUMsTUFDUixHQURRQSxNQUNSO0FBQUEsc0RBTHFDLElBS3JDO0FBQUU7Ozs7O3VIQUdGQyxVLEVBQ0FDLFUsRUFDQUMsTTs7Ozs7Ozs7QUFHQSxvQkFBSSxLQUFLQyxPQUFULEVBQWtCO0FBQ2hCQyxrQkFBQUEsT0FBTyxHQUFHQyxPQUFPLENBQUNDLE9BQVIsQ0FBZ0IsS0FBS0gsT0FBckIsQ0FBVjtBQUNELGlCQUZELE1BRU87QUFDTEMsa0JBQUFBLE9BQU8sR0FBRyxLQUFLTixVQUFMLENBQWdCUyxhQUFoQixFQUFWO0FBQ0Q7O2tEQUNNSCxPQUFPLENBQUNJLElBQVI7QUFBQSwyR0FBYSxrQkFBT0MsRUFBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2xCLDRCQUFBLEtBQUksQ0FBQ04sT0FBTCxHQUFlTSxFQUFmO0FBRGtCLDhEQUVYQSxFQUFFLENBQ05DLFdBREksQ0FDUVYsVUFBVSxJQUFJLGVBRHRCLEVBRUpRLElBRkk7QUFBQSx3SEFFQyxpQkFBT0csS0FBUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEseUVBQ0dGLEVBQUUsQ0FDTkcsT0FESSxDQUVIRCxLQUFLLENBQUNBLEtBRkgsRUFHSCxVQUFDRSxHQUFELEVBQVM7QUFDUCw4Q0FBSUMsYUFBYSxHQUFHQyxlQUFPQyxjQUFQLENBQXNCSCxHQUF0QixDQUFwQjs7QUFDQSwwQ0FBQSxLQUFJLENBQUNkLE1BQUwsQ0FDRSxzQ0FERixFQUVFWSxLQUFLLENBQUNBLEtBRlIsRUFHRUcsYUFIRjs7QUFLQVosMENBQUFBLE1BQU0sQ0FBQ0QsVUFBRCxFQUFhYSxhQUFiLENBQU47QUFDRCx5Q0FYRSxFQVlIO0FBQUVHLDBDQUFBQSxLQUFLLEVBQUU7QUFBVCx5Q0FaRyxFQWNKVCxJQWRJLENBY0MsVUFBQ1UsSUFBRCxFQUFVO0FBQ2QsMENBQUEsS0FBSSxDQUFDbkIsTUFBTCxDQUNFLCtCQURGLEVBRUVZLEtBQUssQ0FBQ0EsS0FGUixFQUdFTyxJQUFJLENBQUNDLFdBSFA7O0FBS0EsaURBQU8sWUFBd0I7QUFDN0IsNENBQUEsS0FBSSxDQUFDcEIsTUFBTCxDQUNFLHlDQURGLEVBRUVZLEtBQUssQ0FBQ0EsS0FGUixFQUdFTyxJQUFJLENBQUNDLFdBSFA7O0FBS0EsbURBQU9WLEVBQUUsQ0FBQ1csTUFBSCxDQUFVRixJQUFJLENBQUNDLFdBQWYsQ0FBUDtBQUNELDJDQVBEO0FBUUQseUNBNUJJLENBREg7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsK0JBRkQ7O0FBQUE7QUFBQTtBQUFBO0FBQUEsMENBaUNFLFVBQUNFLEdBQUQsRUFBUztBQUNkLHFDQUFPaEIsT0FBTyxDQUFDaUIsTUFBUixDQUFlRCxHQUFmLENBQVA7QUFDRCw2QkFuQ0ksQ0FGVzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBYjs7QUFBQTtBQUFBO0FBQUE7QUFBQSxvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwIGZyb20gXCJhbXFwbGliXCI7XG5pbXBvcnQgRGVidWcgZnJvbSBcImRlYnVnXCI7XG5cbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuL2NvbW1vblwiO1xuXG5leHBvcnQgY2xhc3MgQU1RUFN1YnNjcmliZXIge1xuICBwcml2YXRlIGNoYW5uZWw6IGFtcXAuQ2hhbm5lbCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29ubmVjdGlvbjogYW1xcC5Db25uZWN0aW9uLFxuICAgIHByaXZhdGUgbG9nZ2VyOiBEZWJ1Zy5JRGVidWdnZXJcbiAgKSB7fVxuXG4gIHB1YmxpYyBhc3luYyBzdWJzY3JpYmUoXG4gICAgcXVldWVfbmFtZTogc3RyaW5nLFxuICAgIHJvdXRpbmdLZXk6IHN0cmluZyxcbiAgICBhY3Rpb246IChyb3V0aW5nS2V5OiBzdHJpbmcsIG1lc3NhZ2U6IGFueSkgPT4gdm9pZFxuICApOiBQcm9taXNlPCgpID0+IFByb21pc2VMaWtlPGFueT4+IHtcbiAgICBsZXQgcHJvbWlzZTogUHJvbWlzZUxpa2U8YW1xcC5DaGFubmVsPjtcbiAgICBpZiAodGhpcy5jaGFubmVsKSB7XG4gICAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHRoaXMuY2hhbm5lbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UgPSB0aGlzLmNvbm5lY3Rpb24uY3JlYXRlQ2hhbm5lbCgpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGFzeW5jIChjaCkgPT4ge1xuICAgICAgdGhpcy5jaGFubmVsID0gY2g7XG4gICAgICByZXR1cm4gY2hcbiAgICAgICAgLmFzc2VydFF1ZXVlKHF1ZXVlX25hbWUgfHwgXCJncmFwaHFsX3F1ZXVlXCIpXG4gICAgICAgIC50aGVuKGFzeW5jIChxdWV1ZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBjaFxuICAgICAgICAgICAgLmNvbnN1bWUoXG4gICAgICAgICAgICAgIHF1ZXVlLnF1ZXVlLFxuICAgICAgICAgICAgICAobXNnKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlZE1lc3NhZ2UgPSBMb2dnZXIuY29udmVydE1lc3NhZ2UobXNnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcbiAgICAgICAgICAgICAgICAgICdNZXNzYWdlIGFycml2ZWQgZnJvbSBRdWV1ZSBcIiVzXCIgKCVqKScsXG4gICAgICAgICAgICAgICAgICBxdWV1ZS5xdWV1ZSxcbiAgICAgICAgICAgICAgICAgIHBhcnNlZE1lc3NhZ2VcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGFjdGlvbihyb3V0aW5nS2V5LCBwYXJzZWRNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgeyBub0FjazogdHJ1ZSB9XG4gICAgICAgICAgICApXG4gICAgICAgICAgICAudGhlbigob3B0cykgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlcihcbiAgICAgICAgICAgICAgICAnU3Vic2NyaWJlZCB0byBRdWV1ZSBcIiVzXCIgKCVzKScsXG4gICAgICAgICAgICAgICAgcXVldWUucXVldWUsXG4gICAgICAgICAgICAgICAgb3B0cy5jb25zdW1lclRhZ1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICByZXR1cm4gKCk6IFByb21pc2VMaWtlPGFueT4gPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nZ2VyKFxuICAgICAgICAgICAgICAgICAgJ0Rpc3Bvc2luZyBTdWJzY3JpYmVyIHRvIFF1ZXVlIFwiJXNcIiAoJXMpJyxcbiAgICAgICAgICAgICAgICAgIHF1ZXVlLnF1ZXVlLFxuICAgICAgICAgICAgICAgICAgb3B0cy5jb25zdW1lclRhZ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoLmNhbmNlbChvcHRzLmNvbnN1bWVyVGFnKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19