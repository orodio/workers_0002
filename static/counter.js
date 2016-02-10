/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _actor = __webpack_require__(3);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var _createActor = (0, _actor.createActor)({ name: "", count: 0, loggers: [] });

	var register = _createActor.register;
	var registerPost = _createActor.registerPost;
	var emit = _createActor.emit;
	var send = _createActor.send;


	register("inc", function ($$$) {
	  return _extends({}, $$$, {
	    count: $$$.count + 1
	  });
	});

	register("dec", function ($$$) {
	  return _extends({}, $$$, {
	    count: $$$.count - 1
	  });
	});

	register("send count on change", function ($$$, _ref) {
	  var pid = _ref.pid;
	  return _extends({}, $$$, {
	    loggers: [].concat(_toConsumableArray($$$.loggers), [pid])
	  });
	});

	registerPost(function (_ref2, _ref3) {
	  var count = _ref2.count;
	  var loggers = _ref2.loggers;
	  var name = _ref2.name;
	  var type = _ref3.type;

	  switch (type) {
	    case "inc":
	    case "dec":
	      emit(count);
	      loggers.forEach(function (pid) {
	        return send(pid, { type: "update", count: count, name: name });
	      });
	  }
	});

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

	var rand = function rand() {
	  return CHARS[Math.random() * CHARS.length | 0];
	};

	var stamp = function stamp() {
	  return (+new Date()).toString(36);
	};

	var group = function group(n) {
	  var result = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
	  return result.length >= n ? result : group(n, result + rand());
	};

	var guid = exports.guid = function guid() {
	  return [stamp(), group(4), group(4), group(4), group(12)].join("-");
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createActor = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _guid = __webpack_require__(2);

	var createActor = exports.createActor = function createActor() {
	  var $$$ = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var __pid = undefined,
	      __pre = undefined,
	      __post = undefined,
	      __typ = undefined;
	  var __$$$ = $$$;
	  var __fns = {};

	  var register = function register(type, fn) {
	    return __fns[type] = fn;
	  };
	  var registerPre = function registerPre(fn) {
	    return __pre = fn;
	  };
	  var registerPost = function registerPost(fn) {
	    return __post = fn;
	  };

	  var stop = function stop(pid) {
	    return self.postMessage({ type: "@@stop", pid: pid });
	  };
	  var emit = function emit(message) {
	    return self.postMessage({ type: "@@emit", message: message, _from: __pid });
	  };

	  var send = function send(pid, message) {
	    self.postMessage({ type: "@@send", pid: pid, message: message, _from: __pid });
	  };

	  var spawn = function spawn(worker, state) {
	    var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    opts = _extends({}, opts, { pid: opts.pid || (0, _guid.guid)() });
	    self.postMessage({ type: "@spawn@", worker: worker, state: state, opts: opts });
	    return pid;
	  };

	  register("@@stop", function () {
	    return self.close();
	  });
	  register("@@init", function ($$$, _ref) {
	    var pid = _ref.pid;
	    var worker = _ref.worker;
	    var _ref$state = _ref.state;
	    var state = _ref$state === undefined ? null : _ref$state;

	    __pid = pid;
	    __typ = worker;
	    return state != null ? _extends({}, $$$, state) : $$$;
	  });

	  self.addEventListener("message", function (_ref2) {
	    var event = _ref2.data;

	    if (!!__pre) __pre(__$$$, event);
	    if (__fns[event.type]) __$$$ = __fns[event.type](__$$$, event);
	    if (!!__post) __post(__$$$, event);
	  });

	  return {
	    register: register,
	    registerPre: registerPre,
	    registerPost: registerPost,
	    stop: stop,
	    emit: emit,
	    send: send,
	    spawn: spawn
	  };
	};

/***/ }
/******/ ]);