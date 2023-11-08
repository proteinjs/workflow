import React from 'react';
import { Button, IconButton, Typography, Menu, MenuItem, Dropdown, MenuButton } from '@mui/joy';
import { AppBar, Toolbar, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Page } from '../router/Page';
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import { createUrlParams } from '../router/createUrlParams';
import { LinkOrDialog, NavMenu, NavMenuItem } from './NavMenu';

const materialTheme = materialExtendTheme();

export type PageContainerProps = {
    appName: string,
    page: Page,
    toolbarChildren?: React.ReactNode,
    auth?: {
        isLoggedIn: boolean,
        canViewPage: (page: Page) => boolean,
        /** Either a dialog component, or a path to be redirected to */
        login: LinkOrDialog,
        logout: () => Promise<string>
    },
    profileMenuItems?: { name: string, action: LinkOrDialog }[],
    navMenuItems?: NavMenuItem[],
}

const Page = React.memo(({ auth, page, navigate, loginClicked, setLoginClicked }: { auth: PageContainerProps['auth'], page: PageContainerProps['page'], navigate: NavigateFunction, loginClicked: boolean, setLoginClicked: (loginClicked: boolean) => void }) => {
    if (auth?.canViewPage(page))
        return <page.component urlParams={createUrlParams()} navigate={navigate} />;

    if (!auth?.isLoggedIn) {
        if (!loginClicked)
            setLoginClicked(true);
        
        return null;
    }

    navigate('/');
    return null;
});

export function PageContainer(props: PageContainerProps) {
    const navigate = useNavigate();
    const { appName, page, toolbarChildren, auth, profileMenuItems, navMenuItems } = props;
    const [loginClicked, setLoginClicked] = React.useState(false);
    const [selectedProfileMenuItem, setSelectedProfileMenuItem] = React.useState<number>(-1);
    const [navMenuOpen, setNavMenuOpen] = React.useState(false);
    
    React.useEffect(() => {
        if (auth?.canViewPage(page))
            return;

        if (!auth?.isLoggedIn) {
            console.log(`User not logged in, redirecting to login`);
            if (typeof auth?.login === 'string') {
                const p = qualifiedPath(auth.login);
                navigate(p);
            }
        }
    }, [page]);

    return (
        <Box sx={(theme) => {
            const defaultStyles = {};
            if (!page.pageContainerSxProps)
                return defaultStyles;

            let resolvedStyles;
            if (typeof page.pageContainerSxProps === 'function')
                resolvedStyles = Object.assign(defaultStyles, page.pageContainerSxProps(theme));
            else
                resolvedStyles = Object.assign(defaultStyles, page.pageContainerSxProps);

            return resolvedStyles;
        }}>
            <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                <JoyCssVarsProvider>
                    <AppBar position='static'>
                        <Toolbar>
                            { navMenuItems && 
                                <IconButton
                                    aria-label='menu'
                                    onClick={event => setNavMenuOpen(!navMenuOpen)} 
                                    sx={(theme) => ({
                                        marginRight: theme.spacing(2),
                                        '&:hover': {
                                            color: '#fff',
                                        },
                                    })} 
                                    style={{ backgroundColor: 'transparent' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                            }
                            <Typography level='h4' textColor='common.white' sx={{ flexGrow: 1, }}>
                                {appName}
                            </Typography>
                            {toolbarChildren}
                            <AuthIconButton />
                        </Toolbar>
                    </AppBar>
                    <NavMenu navMenuItems={navMenuItems} navMenuOpen={navMenuOpen} setNavMenuOpen={setNavMenuOpen} />
                    <Page auth={auth} page={page} navigate={navigate} loginClicked={loginClicked} setLoginClicked={setLoginClicked} />
                </JoyCssVarsProvider>
            </MaterialCssVarsProvider>
        </Box>
    );

    function AuthIconButton() {
        if (!auth)
            return null;

        if (auth.isLoggedIn) {
            const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
            return (
                <div>
                    <Dropdown>
                        <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
                            sx={{
                                '&:hover': {
                                    color: '#fff',
                                },
                            }}
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <AccountCircle />
                        </MenuButton>
                        <Menu>
                            { profileMenuItems &&
                                profileMenuItems.map((profileMenuItem, index) => (
                                    <MenuItem 
                                        onClick={event => {
                                            if (typeof profileMenuItem.action === 'string'){
                                                navigate(qualifiedPath(profileMenuItem.action));
                                                return;
                                            }

                                            setSelectedIndex(index);
                                        }}
                                        selected={selectedIndex === index}
                                    >
                                        {profileMenuItem.name}
                                    </MenuItem>
                                ))
                            }
                            <MenuItem 
                                onClick={async (event) => {
                                    const redirectPath = await auth.logout();
                                    navigate(qualifiedPath(redirectPath));
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                    <ProfileMenuItemAction />
                </div>
            );
        }

        return (
            <div>
                <Button onClick={event => auth && typeof auth.login === 'string' ? navigate(qualifiedPath(auth.login)) : setLoginClicked(!loginClicked)}>
                    Login
                </Button>
                <Login />
            </div>
        );
    }

    function ProfileMenuItemAction() {
        if (selectedProfileMenuItem == -1 || !auth || !profileMenuItems)
            return null;

        const menuItem = profileMenuItems[selectedProfileMenuItem];
        if (typeof menuItem.action === 'string')
            return null;

        return <menuItem.action onClose={() => setSelectedProfileMenuItem(-1)} />;
    }

    function Login() {
        if (!loginClicked || !auth || typeof auth.login === 'string')
            return null;

        return <auth.login onClose={() => setLoginClicked(false)} />;
    }

    function qualifiedPath(path: string) {
        if (path.startsWith('/'))
            return path;

        return `/${path}`;
    }
}