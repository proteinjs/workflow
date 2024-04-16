import { Loadable } from '@proteinjs/reflection';

export type LocalLoadableType = { a: string } & Loadable;

export type LocalNotLoadableType = { z: number };

export type LocalLoadableTypeWithArgs<T> = { a: number } & Loadable;

export interface LocalLoadableInterface extends Loadable {
	a: number;
}

export interface LocalNotLoadableInterface {
	z: number;
}

export interface LocalLoadableInterfaceWithArgs<T> extends Loadable {
	a: number;
}

export abstract class LocalLoadableAbstractClass implements Loadable {
	abstract a: number;
}

export abstract class LocalNotLoadableAbstractClass {
	abstract z: number;
}

export abstract class LocalLoadableAbstractClassWithArgs<T> implements Loadable {
	abstract a: number;
}