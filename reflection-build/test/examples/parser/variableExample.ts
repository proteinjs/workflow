import { A } from './typeExample';
import { TypeAlias } from 'typescript-parser';

export type E = {
	q: string
};

export type D<T> = E & {
	x: string,
	a: A
};

export const a: D<string> & A & TypeAlias = {
	x: 'yo',
	a: {
		x: 'ya',
		b: {
			x: 'ye'
		}
	},
	b: {
		x: 'ye'
	},
	q: 'le',
	name: 'yo',
	typeParameters: []
};

export class Yo {
	constructor(public whatup: string) { }
}