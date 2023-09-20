import React from 'react';
import { Grid, PaperProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FormPaper } from './FormPaper';

const useStyles = makeStyles<Theme, PaperProps>(theme => ({
	root: {
        marginTop: theme.spacing(4),
    }
}));

export function FormPage(props: PaperProps) {
    const classes = useStyles(props);
    return (
        <Grid
            container
            className={classes.root}
            direction='row'
            justify='center'
            alignItems='center'
        >
            <Grid item>
                <FormPaper {...props}>
                    {props.children}
                </FormPaper>
            </Grid>
        </Grid>
    );
}