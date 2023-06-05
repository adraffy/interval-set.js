import {IntervalSet} from '../src/index.js';

function time(name, fn, ...args) {
	let t0 = performance.now();
	fn(...args);
	console.log(name, performance.now() - t0);
}
function compare(name, fn1, fn2, ...args) {
	console.log(name, args);
	time('w/ ', fn1, ...args);
	time('w/o', fn2, ...args);
}
function compare_same(name, fn, ...args) {
	console.log(name, args);
	time('w/ ', fn, new IntervalSet(), ...args);
	time('w/o', fn, new Set(), ...args);
}

compare_same('Linear Insert', (set, n) => {
	for (let i = 0; i < n; i++) {
		set.add(i);
	}
}, 1_000_000);

compare_same('Linear Overlap', (set, n, step, count) => {
	for (let i = 0, off = 0; i < n; i++, off += step) {
		for (let j = 0; j < count; j++) {
			set.add(off + j);
		}
	}
}, 5000, 1000, 2000);

compare('Linear Overlap (Optimized)', (n, step, count) => {
	let set = new IntervalSet();
	for (let i = 0, off = 0; i < n; i++, off += step) {
		set.add(off, off + count);
	}
}, (n, step, count) => {
	let set = new Set();
	for (let i = 0, off = 0; i < n; i++, off += step) {
		for (let j = 0; j < count; j++) {
			set.add(off + j);
		}
	}
}, 5000, 1000, 2000);

compare_same('Remove % 2', (set, n) => {
	for (let i = 0; i < n; i++) {
		set.add(i);
	}
	for (let i = 0; i < n; i += 2) {
		set.delete(i);
	}
}, 1_000_000);