class Interval {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}
}

export class IntervalSet {
	constructor() {
		this._ranges = [];
	}
	get count() {
		// count = 0 => empty
		// count > 1 => disjoint
		return this._ranges.length;
	}
	get size() {
		return this._ranges.reduce((n, {a, b}) => n + 1 + b - a, 0);
	}
	get min() {
		let v = this._ranges;
		return v.length ? v[0].a : Infinity;
	}
	get max() {
		let v = this._ranges;
		return v.length ? v[v.length-1].b : -Infinity;
	}
	values() {
		let v = new Array(this.size);
		let off = 0;
		for (let {a, b} of this._ranges) {
			for (let i = a; i <= b; i++) {
				v[off++] = i;
			}
		}
		return v;
	}
	toJSON() {
		return [...this];
	}
	*[Symbol.iterator]() {
		for (let {a, b} of this._ranges) {
			yield [a, b];
		}
	}
	has(x) {
		return this._find(x) >= 0;
	}
	add(a, b) {		
		if (b === undefined) b = a; // add(a) === add(a, a)
		if (b < a) return;
		let aa = this._find(a-1);
		if (aa >= 0) { // found lower interval to extend
			let r = this._ranges[aa];
			if (b <= r.b) return; // already contained (fast path)
			r.a = Math.min(r.a, a); // extend lower
			let bb = this._find(b+1, aa); 
			if (bb >= 0) { // found upper interval to extend
				r.b = Math.max(this._ranges[bb].b, b); // extend upper
			} else {
				r.b = b; // resize upper
				bb = ~bb - 1; // skip last node
			}
			let n = bb - aa;
			if (n) this._ranges.splice(aa + 1, n); // delete in between
		} else {
			aa = ~aa; // insertion index
			let bb = this._find(b+1, aa);
			if (bb >= 0) { // found upper interval to extend
				let r = this._ranges[bb];
				r.a = a; // resize lower
				r.b = Math.max(r.b, b); // extend upper
				this._ranges.splice(aa, bb - aa); // delete in between
			} else {
				this._ranges.splice(aa, ~bb - aa, new Interval(a, b));
			}
		}
	}
	delete(a, b) {
		if (b === undefined) b = a; // delete(a) === delete(a, a)
		if (b < a) return; // empty range
		let aa = this._find(a);
		let bb = a === b ? aa : this._find(b);
		if (aa >= 0) {
			let r = this._ranges[aa];
			if (aa === bb) {
				if (r.a === a) {
					if (r.b === b) {
						this._ranges.splice(aa, 1);
					} else {
						r.a = b+1;
					}
				} else if (r.b === b) {
					r.b = a-1;
				} else {
					this._ranges.splice(aa, 0, new Interval(r.a, a-1))
					r.a = b+1;
				}
				return true;
			}
			if (r.a < a) {
				r.b = a-1;
				++aa;
			}
		} else {
			aa = ~aa;
		}
		if (bb >= 0) {
			let r = this._ranges[bb];
			if (r.b > b) {
				r.a = b+1;
				--bb;
			}
		} else {
			bb = ~bb-1;
		}
		this._ranges.splice(aa, 1+bb-aa);
		return true;
	}
	clear() {
		this._ranges.length = 0;
	}
	_find(x, aa = 0) {
		let v = this._ranges;
		let bb = v.length;
		while (aa < bb) {
			let c = (aa + bb) >>> 1;
			let {a, b} = v[c];
			if (x >= a && x <= b) return c;
			if (x < a) {
				bb = c;
			} else {
				aa = c+1;
			}
		}
		return ~aa;
	}
}