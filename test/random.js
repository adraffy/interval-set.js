import {IntervalSet} from '../src/index.js';

function compare_arrays(a, b) {
	let n = a.length;
	let c = n - b.length;
	for (let i = 0; c == 0 && i < n; i++) c = a[i] - b[i];
	return c;
}
function sorted_from_set(set) {
	return [...set].sort((a, b) => a - b);
}
function rng_int(n) {
	return Math.random() * n | 0;
}
function rng_interval_set(n) {
	if (n === undefined) n = rng_int(25);
	let set = new IntervalSet();
	let prev = 0;
	while (n-- > 0) {
		prev += rng_int(10);
		set.add(prev, prev += rng_int(10));
	}
	return set;
}

for (let r = 0; r < 10000; r++) {
	let set = new Set();
	let iset = new IntervalSet();
	for (let mod = 0; mod < 20; mod++) {
		let a = rng_int(1000);
		let b = a + rng_int(100);
		let add = Math.random() < 0.55;
		if (add) {
			iset.add(a, b);
			for (let i = a; i <= b; i++) set.add(i);		
		} else {
			iset.delete(a, b);
			for (let i = a; i <= b; i++) set.delete(i);
		}
		// invariant
		if (iset._ranges.some(x => x.b - x.a < 0)) throw new Error('bug');

		let v1 = [...iset];
		let v2 = sorted_from_set(set);
		if (compare_arrays(v1, v2)) {
			console.log(v1, v2);
			throw new Error('add/remove');
		}
	}
}
console.log('OK add/remove');

for (let r = 0; r < 10000; r++) {
	let a = rng_interval_set();
	let b = rng_interval_set();
	let iset = new IntervalSet(a);
	iset.intersect(b);
	let set = new Set([...a].filter(x => b.has(x)));
	let v1 = [...iset];
	let v2 = sorted_from_set(set);
	if (compare_arrays(v1, v2)) {
		console.log(a, b, v1, v2);
		throw new Error('intersect');
	}
}
console.log('OK intersect');

for (let r = 0; r < 10000; r++) {
	let a = rng_interval_set();
	let b = rng_interval_set();
	let iset = new IntervalSet(a);
	iset.union(b);
	let set = new Set([...a, ...b]);
	let v1 = [...iset];
	let v2 = sorted_from_set(set);
	if (compare_arrays(v1, v2)) {
		console.log(a, b, v1, v2);
		throw new Error('union');
	}
}
console.log('OK union');

for (let r = 0; r < 10000; r++) {
	let a = rng_interval_set();
	let b = rng_interval_set();
	let iset = new IntervalSet(a);
	iset.complement(b);
	let set = new Set([...a].filter(x => !b.has(x)));
	let v1 = [...iset];
	let v2 = sorted_from_set(set);
	if (compare_arrays(v1, v2)) {
		console.log(a, b, v1, v2);
		throw new Error('complement');
	}
}
console.log('OK complement');
