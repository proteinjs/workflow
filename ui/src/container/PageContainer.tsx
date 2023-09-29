import React from 'react';
import { Button, IconButton, Typography, Menu, MenuItem, Drawer, List, ListItem, Dropdown, MenuButton, ListItemButton } from '@mui/joy';
import { AppBar, Toolbar, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, Navigate } from 'react-router-dom';
import { Page } from '../router/Page';
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';

const materialTheme = materialExtendTheme();
const drawerWidth = 240;

/** Either a dialog component, or a path to be redirected to */
export type LinkOrDialog = React.ComponentType<{onClose: () => void}>|string;

export type NavMenuItems = { 
    name: string, 
    action: LinkOrDialog, 
    icon?: React.ComponentType,
    /** Use to make this item a divider */
    // isDivider?: boolean, 
    /** Use to make this item a nested menu */
    // children?: NavMenuItems 
}[];

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
    navMenuItems?: NavMenuItems
}

export function PageContainer(props: PageContainerProps) {
    const navigate = useNavigate();
    const { appName, page, toolbarChildren, auth, profileMenuItems, navMenuItems } = props;
    const [loginClicked, setLoginClicked] = React.useState(false);
    const [selectedProfileMenuItem, setSelectedProfileMenuItem] = React.useState<number>(-1);
    const [navMenuOpen, setNavMenuOpen] = React.useState(false);
    const [selectedNavMenuItem, setSelectedNavMenuItem] = React.useState<number>(-1);
    React.useEffect(() => {
        if (auth?.canViewPage(page))
            return;

        if (!auth?.isLoggedIn) {
            if (typeof auth?.login === 'string') {
                const p = qualifiedPath(auth.login);
                navigate(p);
            }
        }
    }, [page]);

    return (
        <div style={{
            flexGrow: 1,
        }}>
            <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                <JoyCssVarsProvider>
                    <AppBar position='static'>
                        <Toolbar>
                            { navMenuItems && 
                                <IconButton 
                                    onClick={event => setNavMenuOpen(!navMenuOpen)} 
                                    sx={(theme) => ({
                                        marginRight: theme.spacing(2),
                                    })} 
                                    aria-label='menu'
                                >
                                    <MenuIcon />
                                </IconButton>
                            }
                            <Typography level='h4' sx={{ flexGrow: 1, }}>
                                {appName}
                            </Typography>
                            {toolbarChildren}
                            <AuthIconButton />
                        </Toolbar>
                    </AppBar>
                    <NavMenu />
                    <Page />
                </JoyCssVarsProvider>
            </MaterialCssVarsProvider>
        </div>
    );

    function AuthIconButton() {
        if (!auth)
            return null;

        if (auth.isLoggedIn) {
            const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
            return (
                <div>
                    <Dropdown>
                        <MenuButton>
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

    function NavMenu() {
        if (!navMenuItems)
            return null;

        return (
            <div>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                    }}
                    anchor='left'
                    open={navMenuOpen}
                >
                    <Toolbar />
                    <List>
                    {navMenuItems.map((navMenuItem, index) => (
                        <ListItem>
                            <ListItemButton
                                onClick={event => setSelectedNavMenuItem(index)} 
                                key={navMenuItem.name}
                            >
                                { navMenuItem.icon && 
                                    <ListItemIcon>
                                        <navMenuItem.icon />
                                    </ListItemIcon>
                                }
                                <ListItemText primary={navMenuItem.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    </List>
                </Drawer>
                <NavMenuItemAction />
            </div>
        );
    }

    function NavMenuItemAction() {
        if (selectedNavMenuItem == -1 || !navMenuItems)
            return null;

        const menuItem = navMenuItems[selectedNavMenuItem];
        if (typeof menuItem.action === 'string')
            return <Navigate to={menuItem.action} />;

        return <menuItem.action onClose={() => setSelectedNavMenuItem(-1)} />;
    }

    function Page() {
        if (auth?.canViewPage(page))
            return <page.component />;

        if (!auth?.isLoggedIn) {
            if (!loginClicked)
                setLoginClicked(true);
            
            return null;
        }

        navigate('/');
        return null;
    }

    function qualifiedPath(path: string) {
        if (path.startsWith('/'))
            return path;

        return `/${path}`;
    }
}