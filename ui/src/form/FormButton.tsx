import React from 'react';
import { Fields } from './Field';

export type FormButton<F extends Fields> = {
    name: string,
    accessibility?: {
		disabled?: boolean,
		hidden?: boolean,
	};
	style: {
		color?: 'primary'|'neutral'|'danger'|'success'|'warning',
		variant?: 'plain'|'outlined'|'soft'|'solid',
		icon?: React.ComponentType,
    };
    clearFormOnClick?: boolean,
    redirect?: { path: string, props?: { [key: string]: any } },
	onClick?: (fields: F, buttons: FormButtons<F>) => Promise<string|void>,
	progressMessage?: (fields: F) => string
}

export abstract class FormButtons<F extends Fields> { [name: string]: FormButton<F> }

export const clearButton: FormButton<any> = {
	name: 'clear',
	style: {
		color: 'neutral'
	},
	clearFormOnClick: true
};