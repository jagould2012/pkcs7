/*
 * pkcs7.pad
 * https://github.com/brightcove/pkcs7
 *
 * Copyright (c) 2014 Brightcove
 * Licensed under the apache2 license.
 */

let PADDING;

/**
 * Returns a new Uint8Array that is padded with PKCS#7 padding.
 * @param plaintext {Uint8Array} the input bytes before encryption
 * @return {Uint8Array} the padded bytes
 * @see http://tools.ietf.org/html/rfc5652
 */
export default function pad(plaintext, size) {

  size = (size > 16) ? size : 16;
  init(size);
  const padding = PADDING[(plaintext.byteLength % size) || 0];
  const result = new Uint8Array(plaintext.byteLength + padding.length);

  result.set(plaintext);
  result.set(padding, plaintext.byteLength);

  return result;
}

function init(len)
{
  if(!PADDING || PADDING.length != len)
  {
    PADDING = Array(len);
    for(var i=32; i > 0; i--)
    {
      PADDING[len - i] = Array(i).fill(i);
    }

  }
}




