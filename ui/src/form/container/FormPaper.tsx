import React from 'react';
import { PaperProps, Paper } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme, PaperProps>(theme => ({
	root: {
        padding: theme.spacing(2, 2, 1),
		width: 'fit-content'
    }
}));

export function FormPaper(props: PaperProps) {
    const classes = useStyles(props);
    return (
        <Paper className={classes.root} {...props}>
            {props.children}
        </Paper>
    );
}