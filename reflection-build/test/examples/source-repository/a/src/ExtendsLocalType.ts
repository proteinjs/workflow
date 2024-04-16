import { LocalLoadableType, LocalLoadableInterface, LocalLoadableAbstractClass, LocalNotLoadableInterface, LocalNotLoadableAbstractClass, LocalNotLoadableType, LocalLoadableTypeWithArgs, LocalLoadableInterfaceWithArgs, LocalLoadableAbstractClassWithArgs } from './LocalLoadableType';

// variable <- type alias

export const implementsLocalLoadableType: LocalLoadableType = { a: 'la' };

export const implementsLocalNotLoadableType: LocalNotLoadableType = { z: 1 };

export const implementsLocalLoadableTypeWithArgs: LocalLoadableTypeWithArgs<LocalLoadableType> = { a: 1 };


// variable <- type alias <- type alias
export type ExtendsLocalLoadableType = LocalLoadableType & { b: number };

export const implementsExtendsLocalLoadableType: ExtendsLocalLoadableType = { a: 'la', b: 7 };

export type ExtendsLocalNotLoadableType = LocalNotLoadableType & { y: number };

export const implementsExtendsLocalNotLoadableType: ExtendsLocalNotLoadableType = { y: 2, z: 2 };


// class <- interface
export class ImplementsLocalLoadableInterface implements LocalLoadableInterface {
	a = 1;
}

export class ImplementsLocalNotLoadableInterface implements LocalNotLoadableInterface {
	z = 2;
}

export class ImplementsLocalLoadableInterfaceWithArgs implements LocalLoadableInterfaceWithArgs<LocalLoadableInterface> {
	a = 1;
}

// interface <- interface

export interface ExtendsLocalLoadableInterfaceWithArgs extends LocalLoadableInterfaceWithArgs<LocalLoadableInterface> {
	b: number;
}


// class <- abstract class

export class ImplementsLocalLoadableAbstractClass extends LocalLoadableAbstractClass {
	a = 1;
}

export class ImplementsLocalNotLoadableAbstractClass extends LocalNotLoadableAbstractClass {
	z = 1;
}

export class ImplementsLocalLoadableAbstractClassWithArgs extends LocalLoadableAbstractClassWithArgs<LocalLoadableInterface> {
	a = 1;
}


// class <- interface <- interface
export interface ExtendsLocalLoadableInterface extends LocalLoadableInterface {
	b: number;
}

export class ImplementsExtendsLocalLoadableInterface implements ExtendsLocalLoadableInterface {
	a = 1;
	b = 2;
}

export interface ExtendsLocalNotLoadableInterface extends LocalNotLoadableInterface {
	b: number;
}

export class ImplementsExtendsLocalNotLoadableInterface implements ExtendsLocalNotLoadableInterface {
	z = 1;
	b = 2;
}


// class <- abstract class <- abstract class
export abstract class ExtendsLocalLoadableAbstractClass extends LocalLoadableAbstractClass {
	abstract b: number;
}

export class ImplementsExtendsLocalLoadableAbstractClass extends ExtendsLocalLoadableAbstractClass {
	a = 1;
	b = 2;
}

export abstract class ExtendsLocalNotLoadableAbstractClass extends LocalNotLoadableAbstractClass {
	abstract y: number;
}

export class ImplementsExtendsLocalNotLoadableAbstractClass extends ExtendsLocalNotLoadableAbstractClass {
	y = 1;
	z = 2;
}