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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hbXFwL2NvbW1vbi50cyJdLCJuYW1lcyI6WyJMb2dnZXIiLCJtc2ciLCJyZXMiLCJKU09OIiwicGFyc2UiLCJjb250ZW50IiwidG9TdHJpbmciLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBRWFBLE07Ozs7Ozs7bUNBQ2tCQyxHLEVBQXNDO0FBQ2pFLFVBQUlDLEdBQVEsR0FBRyxJQUFmOztBQUNBLFVBQUlELEdBQUosRUFBUztBQUNQLFlBQUk7QUFDRkMsVUFBQUEsR0FBRyxHQUFHQyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsR0FBRyxDQUFDSSxPQUFKLENBQVlDLFFBQVosRUFBWCxDQUFOO0FBQ0QsU0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVTtBQUNWTCxVQUFBQSxHQUFHLEdBQUdELEdBQUcsQ0FBQ0ksT0FBSixDQUFZQyxRQUFaLEVBQU47QUFDRDtBQUNGOztBQUNELGFBQU9KLEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhbXFwIGZyb20gXCJhbXFwbGliXCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICBwdWJsaWMgc3RhdGljIGNvbnZlcnRNZXNzYWdlKG1zZzogYW1xcC5Db25zdW1lTWVzc2FnZSB8IG51bGwpOiBhbnkge1xuICAgIGxldCByZXM6IGFueSA9IG51bGw7XG4gICAgaWYgKG1zZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzID0gSlNPTi5wYXJzZShtc2cuY29udGVudC50b1N0cmluZygpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmVzID0gbXNnLmNvbnRlbnQudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxufVxuIl19