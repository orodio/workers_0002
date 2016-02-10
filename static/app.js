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

	var _pool = __webpack_require__(1);

	// spawn a single logger actor, it will keep track of the total count
	var total = (0, _pool.spawn)("total");
	var $total = document.getElementById("total");
	// listen for the total count to be emitted and render it in the dom
	(0, _pool.listen)(total, function (count) {
	  return $total.innerText = count;
	});

	var winner = (0, _pool.spawn)("winner");
	var $winner = document.getElementById("winner");
	(0, _pool.listen)(winner, function (name) {
	  return $winner.innerText = name;
	});

	// where we will put our counters
	var $counters = document.getElementById("counters");

	var row = function row(key) {
	  // spawn our counter actor for the given key
	  var pid = (0, _pool.spawn)("counter", { name: key });
	  // we want to send the current state of our counter to the total and winner processes so they can do their thing
	  (0, _pool.send)(pid, { type: "send count on change", pid: total });
	  (0, _pool.send)(pid, { type: "send count on change", pid: winner });

	  // build out the row in the dom
	  var $el = document.createElement("div");
	  var $name = document.createElement("strong");
	  var $dec = document.createElement("button");
	  var $count = document.createElement("span");
	  var $inc = document.createElement("button");

	  $name.innerText = key;
	  $dec.innerText = "-1";
	  $count.innerText = 0;
	  $inc.innerText = "+1";

	  $name.classList.add("name");
	  $dec.classList.add("button");
	  $count.classList.add("count");
	  $inc.classList.add("button");

	  $el.appendChild($name);
	  $el.appendChild($dec);
	  $el.appendChild($count);
	  $el.appendChild($inc);
	  $counters.appendChild($el);

	  // when our counter emits the count we want to update the count in the dom
	  (0, _pool.listen)(pid, function (count) {
	    return $count.innerText = count;
	  });

	  // when we click the inc and dec buttons we want to send an inc and dec action to
	  // our counter
	  $inc.addEventListener("click", function (e) {
	    return (0, _pool.send)(pid, { type: "inc" });
	  });
	  $dec.addEventListener("click", function (e) {
	    return (0, _pool.send)(pid, { type: "dec" });
	  });

	  // return our pid so we can use it later if we feel like it
	  return pid;
	};

	// build our initial two rows
	var cat = row("cat");
	var dog = row("dog");

	var $newCounterInput = document.getElementById("new_counter");
	var $newCounterSubmit = document.getElementById("new_counter_submit");

	$newCounterSubmit.addEventListener("click", function (e) {
	  if (!$newCounterInput.value.length) return;
	  row($newCounterInput.value);
	  $newCounterInput.value = "";
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.listen = exports.stop = exports.send = exports.spawn = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _guid = __webpack_require__(2);

	var actors = {};
	var listeners = {};

	var spawn = exports.spawn = function spawn(worker, state) {
	  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var pid = opts.pid || (0, _guid.guid)();

	  actors[pid] = new Worker(worker + ".js");
	  listeners[pid] = {};

	  actors[pid].addEventListener("message", function (_ref) {
	    var data = _ref.data;

	    switch (data.type) {
	      case "@@send":
	        return send(data.pid, data.message, data._from);
	      case "@@spawn":
	        return spawn(data.worker, data.initialState, data.opts);
	      case "@@stop":
	        return stop(data.pid);
	      case "@@emit":
	        return Object.keys(listeners[pid]).forEach(function (fnid) {
	          return listeners[pid][fnid](data.message, data._from);
	        });
	    }
	  }, false);

	  send(pid, {
	    type: "@@init",
	    state: state,
	    pid: pid,
	    worker: worker
	  });

	  return pid;
	};

	var send = exports.send = function send(pid, message, _from) {
	  var msg = _extends({}, message, { _from: _from });
	  if (actors[pid] == null) return false;
	  actors[pid].postMessage(msg);
	  return true;
	};

	var stop = exports.stop = function stop(pid) {
	  send(pid, { type: "@@stop" });
	};

	var listen = exports.listen = function listen(pid, fn) {
	  var fnid = (0, _guid.guid)();
	  listeners[pid][fnid] = fn;

	  return function () {
	    delete listeners[pid][fnid];
	  };
	};

/***/ },
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

/***/ }
/******/ ]);