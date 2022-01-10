// Code generated by colf(1); DO NOT EDIT.
// The compiler used schema file struct.colf for package main.


export default function() {
	const EOF = 'colfer: EOF';

	// The upper limit for serial byte sizes.
	var colferSizeMax = 16 * 1024 * 1024;
	// The upper limit for the number of elements in a list.
	var colferListMax = 64 * 1024;

	// Constructor.

	// When init is provided all enumerable properties are merged into the new object a.k.a. shallow cloning.
	this.Colfbuf = function(init) {

		this.time = null;
		this.time_ns = 0;

		this.directvch0 = new Float64Array(0);

		this.directvch1 = new Float64Array(0);

		this.directvch2 = new Float64Array(0);

		this.directvch3 = new Float64Array(0);

		this.diffv = new Float64Array(0);

		for (var p in init) this[p] = init[p];
	}

	// Serializes the object into an Uint8Array.
	this.Colfbuf.prototype.marshal = function(buf) {
		if (! buf || !buf.length) buf = new Uint8Array(colferSizeMax);
		var i = 0;
		var view = new DataView(buf.buffer);


		if ((this.time && this.time.getTime()) || this.time_ns) {
			var ms = this.time ? this.time.getTime() : 0;
			var s = ms / 1E3;

			var ns = this.time_ns || 0;
			if (ns < 0 || ns >= 1E6)
				throw new Error('colfer: driver/Colfbuf field time_ns not in range (0, 1ms>');
			var msf = ms % 1E3;
			if (ms < 0 && msf) {
				s--
				msf = 1E3 + msf;
			}
			ns += msf * 1E6;

			if (s > 0xffffffff || s < 0) {
				buf[i++] = 0 | 128;
				if (s > 0) {
					view.setUint32(i, s / 0x100000000);
					view.setUint32(i + 4, s);
				} else {
					s = -s;
					view.setUint32(i, s / 0x100000000);
					view.setUint32(i + 4, s);
					var carry = 1;
					for (var j = i + 7; j >= i; j--) {
						var b = (buf[j] ^ 255) + carry;
						buf[j] = b & 255;
						carry = b >> 8;
					}
				}
				view.setUint32(i + 8, ns);
				i += 12;
			} else {
				buf[i++] = 0;
				view.setUint32(i, s);
				i += 4;
				view.setUint32(i, ns);
				i += 4;
			}
		}

		if (this.directvch0 && this.directvch0.length) {
			var a = this.directvch0;
			if (a.length > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch0 length exceeds colferListMax');
			buf[i++] = 1;
			i = encodeVarint(buf, i, a.length);
			a.forEach(function(f) {
				view.setFloat64(i, f);
				i += 8;
			});
		}

		if (this.directvch1 && this.directvch1.length) {
			var a = this.directvch1;
			if (a.length > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch1 length exceeds colferListMax');
			buf[i++] = 2;
			i = encodeVarint(buf, i, a.length);
			a.forEach(function(f) {
				view.setFloat64(i, f);
				i += 8;
			});
		}

		if (this.directvch2 && this.directvch2.length) {
			var a = this.directvch2;
			if (a.length > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch2 length exceeds colferListMax');
			buf[i++] = 3;
			i = encodeVarint(buf, i, a.length);
			a.forEach(function(f) {
				view.setFloat64(i, f);
				i += 8;
			});
		}

		if (this.directvch3 && this.directvch3.length) {
			var a = this.directvch3;
			if (a.length > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch3 length exceeds colferListMax');
			buf[i++] = 4;
			i = encodeVarint(buf, i, a.length);
			a.forEach(function(f) {
				view.setFloat64(i, f);
				i += 8;
			});
		}

		if (this.diffv && this.diffv.length) {
			var a = this.diffv;
			if (a.length > colferListMax)
				throw new Error('colfer: driver.colfbuf.diffv length exceeds colferListMax');
			buf[i++] = 5;
			i = encodeVarint(buf, i, a.length);
			a.forEach(function(f) {
				view.setFloat64(i, f);
				i += 8;
			});
		}


		buf[i++] = 127;
		if (i >= colferSizeMax)
			throw new Error('colfer: driver.colfbuf serial size ' + i + ' exceeds ' + colferSizeMax + ' bytes');
		return buf.subarray(0, i);
	}

	// Deserializes the object from an Uint8Array and returns the number of bytes read.
	this.Colfbuf.prototype.unmarshal = function(data) {
		if (!data || ! data.length) throw new Error(EOF);
		var header = data[0];
		var i = 1;
		var readHeader = function() {
			if (i >= data.length) throw new Error(EOF);
			header = data[i++];
		}

		var view = new DataView(data.buffer, data.byteOffset, data.byteLength);

		var readVarint = function() {
			var pos = 0, result = 0;
			while (pos != 8) {
				var c = data[i+pos];
				result += (c & 127) * Math.pow(128, pos);
				++pos;
				if (c < 128) {
					i += pos;
					if (result > Number.MAX_SAFE_INTEGER) break;
					return result;
				}
				if (pos == data.length) throw new Error(EOF);
			}
			return -1;
		}

		if (header == 0) {
			if (i + 8 > data.length) throw new Error(EOF);

			var ms = view.getUint32(i) * 1E3;
			var ns = view.getUint32(i + 4);
			ms += Math.floor(ns / 1E6);
			this.time = new Date(ms);
			this.time_ns = ns % 1E6;

			i += 8;
			readHeader();
		} else if (header == (0 | 128)) {
			if (i + 12 > data.length) throw new Error(EOF);

			var ms = decodeInt64(data, i) * 1E3;
			var ns = view.getUint32(i + 8);
			ms += Math.floor(ns / 1E6);
			if (ms < -864E13 || ms > 864E13)
				throw new Error('colfer: driver/ field time exceeds ECMA Date range');
			this.time = new Date(ms);
			this.time_ns = ns % 1E6;

			i += 12;
			readHeader();
		}

		if (header == 1) {
			var l = readVarint();
			if (l < 0) throw new Error('colfer: driver.colfbuf.directvch0 length exceeds Number.MAX_SAFE_INTEGER');
			if (l > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch0 length ' + l + ' exceeds ' + colferListMax + ' elements');
			if (i + l * 8 > data.length) throw new Error(EOF);

			this.directvch0 = new Float64Array(l);
			for (var n = 0; n < l; ++n) {
				this.directvch0[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header == 2) {
			var l = readVarint();
			if (l < 0) throw new Error('colfer: driver.colfbuf.directvch1 length exceeds Number.MAX_SAFE_INTEGER');
			if (l > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch1 length ' + l + ' exceeds ' + colferListMax + ' elements');
			if (i + l * 8 > data.length) throw new Error(EOF);

			this.directvch1 = new Float64Array(l);
			for (var n = 0; n < l; ++n) {
				this.directvch1[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header == 3) {
			var l = readVarint();
			if (l < 0) throw new Error('colfer: driver.colfbuf.directvch2 length exceeds Number.MAX_SAFE_INTEGER');
			if (l > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch2 length ' + l + ' exceeds ' + colferListMax + ' elements');
			if (i + l * 8 > data.length) throw new Error(EOF);

			this.directvch2 = new Float64Array(l);
			for (var n = 0; n < l; ++n) {
				this.directvch2[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header == 4) {
			var l = readVarint();
			if (l < 0) throw new Error('colfer: driver.colfbuf.directvch3 length exceeds Number.MAX_SAFE_INTEGER');
			if (l > colferListMax)
				throw new Error('colfer: driver.colfbuf.directvch3 length ' + l + ' exceeds ' + colferListMax + ' elements');
			if (i + l * 8 > data.length) throw new Error(EOF);

			this.directvch3 = new Float64Array(l);
			for (var n = 0; n < l; ++n) {
				this.directvch3[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header == 5) {
			var l = readVarint();
			if (l < 0) throw new Error('colfer: driver.colfbuf.diffv length exceeds Number.MAX_SAFE_INTEGER');
			if (l > colferListMax)
				throw new Error('colfer: driver.colfbuf.diffv length ' + l + ' exceeds ' + colferListMax + ' elements');
			if (i + l * 8 > data.length) throw new Error(EOF);

			this.diffv = new Float64Array(l);
			for (var n = 0; n < l; ++n) {
				this.diffv[n] = view.getFloat64(i);
				i += 8;
			}
			readHeader();
		}

		if (header != 127) throw new Error('colfer: unknown header at byte ' + (i - 1));
		if (i > colferSizeMax)
			throw new Error('colfer: driver.colfbuf serial size ' + size + ' exceeds ' + colferSizeMax + ' bytes');
		return i;
	}

	// private section

	var encodeVarint = function(bytes, i, x) {
		while (x > 127) {
			bytes[i++] = (x & 127) | 128;
			x /= 128;
		}
		bytes[i++] = x & 127;
		return i;
	}

	function decodeInt64(data, i) {
		var v = 0, j = i + 7, m = 1;
		if (data[i] & 128) {
			// two's complement
			for (var carry = 1; j >= i; --j, m *= 256) {
				var b = (data[j] ^ 255) + carry;
				carry = b >> 8;
				v += (b & 255) * m;
			}
			v = -v;
		} else {
			for (; j >= i; --j, m *= 256)
				v += data[j] * m;
		}
		return v;
	}

	function encodeUTF8(s) {
		var i = 0, bytes = new Uint8Array(s.length * 4);
		for (var ci = 0; ci != s.length; ci++) {
			var c = s.charCodeAt(ci);
			if (c < 128) {
				bytes[i++] = c;
				continue;
			}
			if (c < 2048) {
				bytes[i++] = c >> 6 | 192;
			} else {
				if (c > 0xd7ff && c < 0xdc00) {
					if (++ci >= s.length) {
						bytes[i++] = 63;
						continue;
					}
					var c2 = s.charCodeAt(ci);
					if (c2 < 0xdc00 || c2 > 0xdfff) {
						bytes[i++] = 63;
						--ci;
						continue;
					}
					c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
					bytes[i++] = c >> 18 | 240;
					bytes[i++] = c >> 12 & 63 | 128;
				} else bytes[i++] = c >> 12 | 224;
				bytes[i++] = c >> 6 & 63 | 128;
			}
			bytes[i++] = c & 63 | 128;
		}
		return bytes.subarray(0, i);
	}

	function decodeUTF8(bytes) {
		var i = 0, s = '';
		while (i < bytes.length) {
			var c = bytes[i++];
			if (c > 127) {
				if (c > 191 && c < 224) {
					c = (i >= bytes.length) ? 63 : (c & 31) << 6 | bytes[i++] & 63;
				} else if (c > 223 && c < 240) {
					c = (i + 1 >= bytes.length) ? 63 : (c & 15) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
				} else if (c > 239 && c < 248) {
					c = (i + 2 >= bytes.length) ? 63 : (c & 7) << 18 | (bytes[i++] & 63) << 12 | (bytes[i++] & 63) << 6 | bytes[i++] & 63;
				} else c = 63
			}

			if (c <= 0xffff) s += String.fromCharCode(c);
			else if (c > 0x10ffff) s += '?';
			else {
				c -= 0x10000;
				s += String.fromCharCode(c >> 10 | 0xd800)
				s += String.fromCharCode(c & 0x3FF | 0xdc00)
			}
		}
		return s;
	}

	return this
}
