'use strict';

/*
 * pkcs7.pad
 * https://github.com/brightcove/pkcs7
 *
 * Copyright (c) 2014 Brightcove
 * Licensed under the apache2 license.
 */

var PADDING = void 0;

/**
 * Returns a new Uint8Array that is padded with PKCS#7 padding.
 * @param plaintext {Uint8Array} the input bytes before encryption
 * @return {Uint8Array} the padded bytes
 * @see http://tools.ietf.org/html/rfc5652
 */
function pad(plaintext, size) {

  size = size > 16 ? size : 16;
  init(size);
  var padding = PADDING[plaintext.byteLength % size || 0];
  var result = new Uint8Array(plaintext.byteLength + padding.length);

  result.set(plaintext);
  result.set(padding, plaintext.byteLength);

  return result;
}

function init(len) {
  if (!PADDING || PADDING.length != len) {
    PADDING = Array(len);
    for (var i = 32; i > 0; i--) {
      PADDING[len - i] = Array(i).fill(i);
    }
  }
}

/**
 * Returns the subarray of a Uint8Array without PKCS#7 padding.
 * @param padded {Uint8Array} unencrypted bytes that have been padded
 * @return {Uint8Array} the unpadded bytes
 * @see http://tools.ietf.org/html/rfc5652
 */
function unpad(padded) {
  return padded.subarray(0, padded.byteLength - padded[padded.byteLength - 1]);
}

/* eslint-disable object-shorthand */

var pkcs7 = { pad: pad, unpad: unpad };

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var exports$1 = {
  pkcs7: {
    'pads empty buffers': function padsEmptyBuffers(test) {

      test.expect(1);
      var result = pkcs7.unpad(pkcs7.pad(new Uint8Array([])));

      test.deepEqual(new Uint8Array(result, result.byteOffset, result.byteLength), new Uint8Array(0), 'accepts an empty buffer');
      test.done();
    },
    'pads non-empty buffers': function padsNonEmptyBuffers(test) {
      var i = 16;

      test.expect(i * 3);
      while (i--) {
        // build the test buffer
        var buffer = new Uint8Array(i + 1);
        var result = void 0;

        result = pkcs7.pad(buffer);
        test.equal(result.length % 16, 0, 'padded length is a multiple of 16');
        test.equal(result.slice(-1)[0], 16 - (i + 1) % 16, 'appended the correct value');

        result = pkcs7.unpad(result);

        test.deepEqual(new Uint8Array(result, result.byteOffset, result.byteLength), buffer, 'padding is reversible');
      }
      test.done();
    },
    'works on buffers greater than sixteen bytes': function worksOnBuffersGreaterThanSixteenBytes(test) {
      var buffer = new Uint8Array(16 * 3 + 9);

      test.expect(2);

      test.equal(pkcs7.pad(buffer).length - buffer.length, 16 - 9, 'adds the correct amount of padding');
      var result = pkcs7.unpad(pkcs7.pad(buffer));

      test.deepEqual(new Uint8Array(result, result.byteOffset, result.byteLength), buffer, 'is reversible');
      test.done();
    }
  }
};

module.exports = exports$1;
