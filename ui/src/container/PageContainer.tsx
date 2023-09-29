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
// const useStyles = makeStyles(theme => ({
//     root: {
//         flexGrow: 1,
//     },
// 	menuButton: {
//         marginRight: theme.spacing(2),
//     },
//     title: {
//         flexGrow: 1,
//     },
//     drawer: {
//         width: drawerWidth,
//         flexShrink: 0,
//     },
//     drawerPaper: {
//         width: drawerWidth,
//     },
// }));

// const theme = extendTheme({
//     components: {
//         JoyChip: {
//         defaultProps: {
//             size: 'sm',
//         },
//         styleOverrides: {
//             root: {
//             borderRadius: '4px',
//             },
//         },
//         },
//     },
// });

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
    // const history = useHistory();
    const navigate = useNavigate();
    const { appName, page, toolbarChildren, auth, profileMenuItems, navMenuItems } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const profileMenuOpen = Boolean(anchorEl);
    const handleProfileMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };
    const [loginClicked, setLoginClicked] = React.useState(false);
    const [selectedProfileMenuItem, setSelectedProfileMenuItem] = React.useState<number>(-1);
    const [navMenuOpen, setNavMenuOpen] = React.useState(false);
    const [selectedNavMenuItem, setSelectedNavMenuItem] = React.useState<number>(-1);

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
            return (
                <div>
                    {/* <IconButton
                        aria-label='account of current user'
                        aria-controls='menu-appbar'
                        aria-haspopup='true'
                        onClick={handleProfileMenu}
                        color='inherit'
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id='menu-appbar'
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={profileMenuOpen}
                        onClose={handleProfileMenuClose}
                    >
                        { profileMenuItems &&
                            profileMenuItems.map((profileMenuItem, index) => (
                                <MenuItem 
                                    onClick={event => {
                                        if (typeof profileMenuItem.action === 'string'){
                                            history.push(profileMenuItem.action);
                                            return;
                                        }

                                        setSelectedProfileMenuItem(index)
                                    }}
                                >
                                    {profileMenuItem.name}
                                </MenuItem>
                            ))
                        }
                        <MenuItem onClick={event => auth.logout().then(redirectPath => history.push(redirectPath))}>
                            Logout
                        </MenuItem>
                    </Menu> */}
                    <Dropdown>
                        <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                            onClick={handleProfileMenu}
                        >
                            <AccountCircle />
                        </MenuButton>
                        <Menu
                            id='menu-appbar'
                            // anchorEl={anchorEl}
                            // anchorOrigin={{
                            //     vertical: 'top',
                            //     horizontal: 'right',
                            // }}
                            // keepMounted
                            // transformOrigin={{
                            //     vertical: 'top',
                            //     horizontal: 'right',
                            // }}
                            open={profileMenuOpen}
                            onClose={handleProfileMenuClose}
                        >
                            { profileMenuItems &&
                                profileMenuItems.map((profileMenuItem, index) => (
                                    <MenuItem 
                                        onClick={event => {
                                            if (typeof profileMenuItem.action === 'string'){
                                                navigate(profileMenuItem.action);
                                                return;
                                            }

                                            setSelectedProfileMenuItem(index)
                                        }}
                                    >
                                        {profileMenuItem.name}
                                    </MenuItem>
                                ))
                            }
                            <MenuItem onClick={event => auth.logout().then(redirectPath => navigate(redirectPath))}>
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
                <Button onClick={event => auth && typeof auth.login === 'string' ? navigate(auth.login) : setLoginClicked(!loginClicked)}>
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
                    // classes={{
                    //     paper: classes.drawerPaper,
                    // }}
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
            if (typeof auth?.login === 'string') {
                // if (history.location.pathname == qualifiedPath(auth.login))
                //     return <page.component />;

                navigate(auth.login);
                return null;
            }

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