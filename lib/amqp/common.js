"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Logger = /*#__PURE__*/function () {
  function Logger() {
    (0, _classCallCheck2["default"])(this, Logger);
  }

  (0, _createClass2["default"])(Logger, null, [{
    key: "convertMessage",
    value: function convertMessage(msg) {
      var res = null;

      if (msg) {
        try {
          res = JSON.parse(msg.content.toString());
        } catch (e) {
          res = msg.content.toString();
        }
      }

      return res;
    }
  }]);
  return Logger;
}();

exports.Logger = Logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbXFwL2NvbW1vbi50cyJdLCJuYW1lcyI6WyJMb2dnZXIiLCJtc2ciLCJyZXMiLCJKU09OIiwicGFyc2UiLCJjb250ZW50IiwidG9TdHJpbmciLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBRWFBLE07Ozs7Ozs7bUNBRW9CQyxHLEVBQXNDO0FBQ2pFLFVBQUlDLEdBQVEsR0FBRyxJQUFmOztBQUNBLFVBQUlELEdBQUosRUFBUztBQUNQLFlBQUk7QUFDRkMsVUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsR0FBRyxDQUFDSSxPQUFKLENBQVlDLFFBQVosRUFBWCxDQUFOO0FBQ0QsU0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVTtBQUNWTCxVQUFBQSxHQUFHLEdBQUdELEdBQUcsQ0FBQ0ksT0FBSixDQUFZQyxRQUFaLEVBQU47QUFDRDtBQUNGOztBQUNELGFBQU9KLEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwIGZyb20gJ2FtcXBsaWInO1xuXG5leHBvcnQgY2xhc3MgTG9nZ2VyIHtcblxuICAgIHB1YmxpYyBzdGF0aWMgY29udmVydE1lc3NhZ2UobXNnOiBhbXFwLkNvbnN1bWVNZXNzYWdlIHwgbnVsbCk6IGFueSB7XG4gICAgICBsZXQgcmVzOiBhbnkgPSBudWxsO1xuICAgICAgaWYgKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlcyA9IEpTT04ucGFyc2UobXNnLmNvbnRlbnQudG9TdHJpbmcoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXMgPSBtc2cuY29udGVudC50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxufVxuIl19