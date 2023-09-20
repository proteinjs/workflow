import React from 'react';
import { PropTypes } from '@material-ui/core';
import { Fields } from './Field';

export type FormButton<F extends Fields> = {
    name: string,
    accessibility?: {
		disabled?: boolean,
		hidden?: boolean,
	};
	style: {
		color?: PropTypes.Color,
		border?: boolean,
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
		color: 'secondary'
	},
	clearFormOnClick: true
};