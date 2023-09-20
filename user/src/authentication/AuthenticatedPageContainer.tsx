import React from 'react';
import { Page, PageContainer, PageContainerProps } from '@proteinjs/ui';
import { Auth } from '../authorization/Auth';
import { loginPage } from '../pages/Login';
import { logout } from '../routes/logout';
import { guestUser, userCache } from '../authorization/userCache';
declare let proteinjs: any;

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
                login: loginPage.path,
                logout: async () => {
                    const response = await fetch(logout.path, {
                        method: logout.method,
                        redirect: 'follow',
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.status != 200)
                        throw new Error(`Failed to log out`);

                    proteinjs['sessionData']['data'][userCache.key] = guestUser;
                    setIsLoggedIn(false);
                    return '/';
                }
            }}
            {...other}
        />
    );
}