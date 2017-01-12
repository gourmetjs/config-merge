"use strict";

// Because merge can be called with a mixture of objects and arrays from both
// gourmet-server context and userland context, we can't simply use
// `obj.constructor === Object|Array` for detecting a plain object or array.
function _isPlainObject(obj) {
  return obj && typeof obj === "object"
      && typeof obj.constructor === "function"
      && obj.constructor.name === "Object";
}

function _isArray(arr) {
  return arr && typeof arr === "object"
      && typeof arr.constructor === "function"
      && arr.constructor.name === "Array";
}

function _merge(des, src) {
  var prop, srcval, desval;
  for (prop in src) {
    srcval = src[prop];
    if (srcval !== undefined) {
      if (_isPlainObject(srcval)) {
        desval = des[prop];
        if (_isPlainObject(desval))
          _merge(desval, srcval);
        else
          des[prop] = _merge({}, srcval);  // make a deep copy
      } else if (_isArray(srcval)) {
        des[prop] = [].concat(srcval);     // make a shallow copy
      } else {
        des[prop] = srcval;
      }
    }
  }
  return des;
}

/**
 * Recursively merges source objects into one final destination object.
 * This is used to merge config objects to get a final one.
 * Key behaviors are:
 *  - Arrays overwrite the destination value (as opposed to Lodash's `merge`
 *    which merges individual elements.)
 *  - Non-plain objects (class instances) are ref-copied, not cloned.
 **/
module.exports = function merge(des) {
  var idx, len, src;
  for (idx = 1, len = arguments.length; idx < len; idx++) {
    src = arguments[idx];
    if (_isPlainObject(src))
      _merge(des, src);
  }
  return des;
};
