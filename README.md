# interval-set.js
Integer Interval Set

```js
import {IntervalSet} from '@adraffy/interval-set';

let set = new IntervalSet();

set.add(1);
set.add(3, 5);
set.add(7);

console.log([...set]);
// [ [ 1, 1 ], [ 3, 5 ], [ 7, 7 ] ]

console.log(set.values());
// [1, 3, 4, 5, 7]

// properties
console.log(set.min);    // 1
console.log(set.max);    // 7
console.log(set.has(4)); // true
console.log(set.count);  // 3
console.log(set.size);   // 5

// iterate
for (let [a, b] of set) {
	console.log(a, b);
}

set.add(0, 9);
// [ [ 0, 9 ] ]

set.delete(4);
console.log([...set]);
// [ [ 0, 3 ], [ 5, 9 ] ]


set.clear();
// []
```