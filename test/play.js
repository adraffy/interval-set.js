import {IntervalSet} from '../src/index.js';

let set = new IntervalSet();

set.add(1);
set.add(3, 5);
set.add(7);

console.log([...set]);

console.log(set.min); // 1
console.log(set.max); // 7
console.log(set.has(4)); // true

for (let [a, b] of set) {
	console.log(a, b);
}

set.add(0, 9);

set.delete(4);
console.log([...set]);
