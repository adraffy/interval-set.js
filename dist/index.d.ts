export class IntervalSet<T extends Number>{
	constructor(x?: Iterable<T>);
	get count(): number;
	get size(): number;
	get min(): T;
	get max(): T;
	values(): T[];
	intervals(): [T, T][];
	has(x: T): boolean;
	add(from: T, to?: T): void;
	delete(from: T, to?: T): void;
	union(that: this): void;
	intersect(that: this): void;
	complement(that: this): void;
	clear(): void;
	[Symbol.iterator](): IterableIterator<T>;
}