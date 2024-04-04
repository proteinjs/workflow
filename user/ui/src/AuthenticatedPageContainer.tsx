import React from 'react';
import { Page, PageContainer, PageContainerProps } from '@proteinjs/ui';
import { routes, guestUser, Auth } from '@proteinjs/user';
import { loginPath } from './pages/Login';

export type AuthenticatedPageContainerProps = Omit<PageContainerProps, 'auth'>;

export function AuthenticatedPageContainer(props: AuthenticatedPageContainerProps) {
    const { ...other } = props;
    const [isLoggedIn, setIsLoggedIn] = React.useState(Auth.isLoggedIn());

    return (
        <PageContainer
            auth={{
                isLoggedIn,
                canViewPage: (page: Page) => {
                    if (page.public)
                        return true;

                    if (!page.roles)
                        return Auth.hasRole('admin');

                    return Auth.hasRoles(page.roles);
                },
                login: loginPath,
                logout: async () => {
                    const response = await fetch(routes.logout.path, {
                        method: routes.logout.method,
                        redirect: 'follow',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.status != 200)
                        throw new Error(`Failed to log out`);

                    Auth.setUser(guestUser);
                    setIsLoggedIn(false);
                    return loginPath;
                }
            }}
            {...other}
        />
    );
}