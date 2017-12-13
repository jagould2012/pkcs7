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

var version = "1.0.2";

exports.pad = pad;
exports.unpad = unpad;
exports.VERSION = version;
