import React from 'react';
import { Button, IconButton, Typography, AppBar, Toolbar, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Redirect, useHistory } from 'react-router-dom';
import { Page } from '../router/Page';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
	menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
}));

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
    const classes = useStyles(props);
    const history = useHistory();
    const theme = useTheme();
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
        <div className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    { navMenuItems && 
                        <IconButton onClick={event => setNavMenuOpen(!navMenuOpen)} edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
                            <MenuIcon />
                        </IconButton>
                    }
                    <Typography variant='h6' className={classes.title}>
                        {appName}
                    </Typography>
                    {toolbarChildren}
                    <AuthIconButton />
                </Toolbar>
            </AppBar>
            <NavMenu />
            <Page />
        </div>
    );

    function AuthIconButton() {
        if (!auth)
            return null;

        if (auth.isLoggedIn) {
            return (
                <div>
                    <IconButton
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
                    </Menu>
                    <ProfileMenuItemAction />
                </div>
            );
        }

        return (
            <div>
                <Button color='inherit' onClick={event => auth && typeof auth.login === 'string' ? history.push(auth.login) : setLoginClicked(!loginClicked)}>
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
                    className={classes.drawer}
                    variant='persistent'
                    anchor='left'
                    open={navMenuOpen}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <List>
                    {navMenuItems.map((navMenuItem, index) => (
                        <ListItem 
                            button 
                            onClick={event => setSelectedNavMenuItem(index)} 
                            key={navMenuItem.name}
                        >
                            { navMenuItem.icon && 
                                <ListItemIcon>
                                    <navMenuItem.icon />
                                </ListItemIcon>
                            }
                            <ListItemText primary={navMenuItem.name} />
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
            return <Redirect to={menuItem.action} />;

        return <menuItem.action onClose={() => setSelectedNavMenuItem(-1)} />;
    }

    function Page() {
        if (auth?.canViewPage(page))
            return <page.component />;

        if (!auth?.isLoggedIn) {
            if (typeof auth?.login === 'string') {
                if (history.location.pathname == qualifiedPath(auth.login))
                    return <page.component />;

                history.push(auth.login);
                return null;
            }

            if (!loginClicked)
                setLoginClicked(true);
            
            return null;
        }

        history.push('/');
        return null;
    }

    function qualifiedPath(path: string) {
        if (path.startsWith('/'))
            return path;

        return `/${path}`;
    }
}