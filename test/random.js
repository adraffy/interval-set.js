import {IntervalSet} from '../src/index.js';

for (let r = 0; r < 1000; r++) {
	let set = new Set();
	let iset = new IntervalSet();
	for (let mod = 0; mod < 1000; mod++) {
		let a = Math.random() * 1000|0;
		let b = a + Math.random()*100|0; 
		let add = Math.random() < 0.55;
		if (add) {
			iset.add(a, b);
			for (let i = a; i <= b; i++) set.add(i);		
		} else {
			iset.delete(a, b);
			for (let i = a; i <= b; i++) set.delete(i);
		}
		// invariant
		if (iset._ranges.some(x => x.size < 1)) throw new Error('bug');

		let v1 = iset.values();
		let v2 = [...set].sort((a, b) => a - b);
		if (v1.length !== v2.length || v1.some((x, i) => x !== v2[i])) {
			console.log({v1, v2});
			throw new Error();
		}
	}
}
