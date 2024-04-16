import { Loadable } from '@proteinjs/reflection';

export type LoadableForeignType = Loadable & { z: number };

export type NotLoadableForeignType = { z: number };

export interface LoadableForeignInterface extends Loadable {
	z: number;
}

export interface NotLoadableForeignInterface {
	z: number;
}

export abstract class LoadableForeignAbstractClass implements Loadable {
	abstract z: number;
}

export abstract class NotLoadableForeignAbstractClass {
	abstract z: number;
}