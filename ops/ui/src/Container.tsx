import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { StylesProvider, createGenerateClassName } from '@material-ui/core/styles';
import { AuthenticatedPageContainer } from '@proteinjs/user';
import { Page } from '@proteinjs/ui';

const generateClassName = createGenerateClassName({
    productionPrefix: 'ops',
});
  
const theme = createMuiTheme({
    spacing: 8
});

export function ThemedContainer(props: React.PropsWithChildren<{}>) {
    return (
        <StylesProvider generateClassName={generateClassName}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </StylesProvider>
    );
}

export function PageContainer(props: { page: Page }) {
    return (
        <ThemedContainer>
            <AuthenticatedPageContainer appName='Ops' page={props.page} />
        </ThemedContainer>
    );
}