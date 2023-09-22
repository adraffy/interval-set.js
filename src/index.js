class Interval {
	constructor(a, b) {
		this.a = a;
		this.b = b;
	}
	/*
	has(x) {
		return x >= this.a && x <= this.b;
		//return this.covers(a, a);
	}
	covers(a, b) {
		return a >= this.a && b <= this.b;
	}
	clone() {
		return new this.constructor(this.a, this.b);
	}
	*/
}

const I = Symbol.iterator;

export class IntervalSet {
	constructor(iterable) {
		if (iterable instanceof this.constructor) {
			this._ranges = iterable._ranges.map(x => new Interval(x.a, x.b));
		} else {
			this._ranges = [];
			if (iterable) {
				for (let x of iterable) {
					this.add(x);
				}
			}
		}
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
	intervals() {
		return this._ranges.map(x => [x.a, x.b]);
	}
	values() {
		return [...this];
	}
	*[I]() {
		for (let {a, b} of this._ranges) {
			while (a <= b) {
				yield a++;
			}
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
		let bb = a === b ? aa : this._find(b, Math.max(0, aa));
		let dirty;
		if (aa >= 0) {
			let r = this._ranges[aa];
			if (aa === bb) { // single interval
				// [1, 2, 3, 4] 
				// (4) possibilities: 
				//    [2, 3, 4] -- truncate start
				// [1, 2, 3]    -- truncate end
				// [1]   [3, 4] -- remove middle (new node)
				//              -- remove all (delete node)
				if (r.a === a) {
					if (r.b === b) { // remove all
						this._ranges.splice(aa, 1); // delete node
					} else {  // truncate start
						r.a = b+1;
					}
				} else if (r.b === b) { // truncate end
					r.b = a-1;
				} else { // remove middle
					this._ranges.splice(aa, 0, new Interval(r.a, a-1)); // new node
					r.a = b+1;
				}
				return true;
			}
			if (r.a < a) { // truncate first
				r.b = a-1; 
				++aa;
				dirty = true;
			}
		} else {
			aa = ~aa;
		}
		// multi interval
		// [1, 2] [3] [4, 5] 
		// [1]               -- 1. truncate first?
		//               [5] -- 2. truncate last?
		//        XXX        -- 3. remove middle
		if (bb >= 0) {
			let r = this._ranges[bb];
			if (r.b > b) {
				r.a = b+1; // truncate last
				dirty = true;
			} else {
				++bb;
			}
		} else {
			bb = ~bb;
		}
		let n = bb - aa;
		if (n) {
			this._ranges.splice(aa, n); // remove middle
			dirty = true;
		}
		return dirty;
	}
	union(that) {
		for (let x of that._ranges) {
			this.add(x.a, x.b);
		}
	}
	intersect(that) {
		let v = [];
		let A = this._ranges;
		let B = that._ranges;
		let i = 0;
		let j = 0;
		while (i < A.length && j < B.length) {
			let a = Math.max(A[i].a, B[j].a);
			let b = Math.min(A[i].b, B[j].b);
			if (a <= b) {
				v.push(new Interval(a, b));
				if (A[i].b === b) i++;
				if (B[j].b === b) j++;
			} else if (A[i].a < B[j].a) {
				i++;
			} else {
				j++;
			}
		}
		this._ranges = v;
	}
	complement(that) {
		for (let x of that._ranges) {
			this.delete(x.a, x.b);
		}
	}
	clear() {
		this._ranges.length = 0;
	}
	_find(x, aa = 0) {
		// binary search w/lower bound hint
		let v = this._ranges;
		let bb = v.length;
		while (aa < bb) {
			let cc = (aa + bb) >>> 1; // middle
			let {a, b} = v[cc];
			if (x >= a && x <= b) return cc; // found
			if (x < a) {
				bb = cc; // search below
			} else {
				aa = cc+1; // search above
			}
		}
		return ~aa; // insertion index
	}
}