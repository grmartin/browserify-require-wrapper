const through = require('through');
const path = require('path');

function _dontDoAnything(x) {
  return false;
}

function _jqueryBrowserifyWrap(f,d) {
  return '(function () {' + d + '}).call((function(window, _jQuery){ if (window.jQuery === undefined) window.jQuery = _jQuery; return window;})(window, require(\'jquery\')));';
}

function _defaultWindowWrap(f,d) {
  return '(function () {' + d + '}).call(window));';
}

function _process(args, file, data, callback) {
  args = args || {};
  args.shouldWrap = args.shouldWrap || _dontDoAnything;
  args.wrappingCall = args.wrappingCall || _defaultWindowWrap;

  if (args.shouldWrap(file)) {
    callback(args.wrappingCall(file, data));
  } else {
    callback(data);
  }
}

function transformHla(funct) {
  return function _transformer(file, args) {
    var data = '', stream = through(write, end);

    return stream;

    function write(buf) {
      data += buf;
    }

    function end() {
      funct(args, file, data, function (result) {
        stream.queue(result);
        stream.queue(null);
      });
    }
  }
}
module.exports = transformHla(_process);
module.exports.DefaultjQueryWrap = _jqueryBrowserifyWrap;
module.exports.DefaultWindowWrap = _defaultWindowWrap;
