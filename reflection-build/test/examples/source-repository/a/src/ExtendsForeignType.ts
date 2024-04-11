import { LoadableForeignType, NotLoadableForeignType, LoadableForeignInterface, NotLoadableForeignInterface, LoadableForeignAbstractClass, NotLoadableForeignAbstractClass } from '@proteinjs/reflection-build-test-b';

// variable <- type alias

export const implementsLoadableForeignType: LoadableForeignType = { z: 1 };

export const implementsNotLoadableForeignType: NotLoadableForeignType = { z: 1 };


// variable <- type alias <- type alias

export type ExtendsLoadableForeignType = LoadableForeignType & { y: string };

export const implementsExtendsLoadableForeignType: ExtendsLoadableForeignType = { z: 7, y: 'la' };

export type ExtendsNotLoadableForeignType = NotLoadableForeignType & { y: string };

export const implementsExtendsNotLoadableForeignType: ExtendsNotLoadableForeignType = { z: 7, y: 'la' };


// class <- interface

export class ImplementsLoadableForeignInterface implements LoadableForeignInterface {
	z = 1;
}

export class ImplementsNotLoadableForeignInterface implements NotLoadableForeignInterface {
	z = 1;
}

// class <- abstract class

export class ImplementsLoadableForeignAbstractClass extends LoadableForeignAbstractClass {
	z = 1;
}

export class ImplementsNotLoadableForeignAbstractClass extends NotLoadableForeignAbstractClass {
	z = 1;
}


// class <- interface <- interface
export interface ExtendsLoadableForeignInterface extends LoadableForeignInterface {
	b: number;
}

export class ImplementsExtendsLoadableForeignInterface implements ExtendsLoadableForeignInterface {
	z = 1;
	b = 2;
}

export interface ExtendsNotLoadableForeignInterface extends NotLoadableForeignInterface {
	b: number;
}

export class ImplementsExtendsLocalNotLoadableInterface implements ExtendsNotLoadableForeignInterface {
	z = 1;
	b = 2;
}


// class <- abstract class <- abstract class
export abstract class ExtendsLoadableForeignAbstractClass extends LoadableForeignAbstractClass {
	abstract b: number;
}

export class ImplementsExtendsLoadableForeignAbstractClass extends ExtendsLoadableForeignAbstractClass {
	z = 1;
	b = 2;
}

export abstract class ExtendsNotLoadableForeignAbstractClass extends NotLoadableForeignAbstractClass {
	abstract y: number;
}

export class ImplementsExtendsNotLoadableForeignAbstractClass extends ExtendsNotLoadableForeignAbstractClass {
	y = 1;
	z = 2;
}