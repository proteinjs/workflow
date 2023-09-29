import React from 'react';
import { Grid, Sheet } from '@mui/joy';
import { PaperProps } from '@mui/material'
import { FormPaper } from './FormPaper';

export function FormPage(props: PaperProps) {
    return (
        <Grid
            container
            sx={(theme) => ({
                marginTop: theme.spacing(4),
            })} 
            direction='row'
            justifyContent='center'
            alignItems='center'
        >
            <Sheet>
                <FormPaper {...props}>
                    {props.children}
                </FormPaper>
            </Sheet>
        </Grid>
    );
}