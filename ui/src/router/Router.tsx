import React from 'react';
import * as ReactRouter from 'react-router';
import * as ReactDom from 'react-dom';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { Page, getPages } from './Page';

export type AppOptions = {
    pageContainer?: React.ComponentType<{ page: Page }>,
    pageNotFound?: React.ComponentType
}

export function loadApp(options: AppOptions = {}) {
    ReactDom.render(<Router pages={getPages()} options={options} />, document.getElementById('app'));
}

export function Router(props: { pages: Page[], options: AppOptions }) {
    const { pages, options } = props;
    return (
        <div>
            <CssBaseline />
            <BrowserRouter>
                <Switch>
                    {
                        (() => {
                            const routes = [];
                            let key = 0;
                            for (const page of pages) {
                            routes.push(<ReactRouter.Route path={getPath(page.path)} exact={true} component={options.pageContainer && !page.noPageContainer ? () => <ContainerizedComponent container={options.pageContainer} page={page}/> : page.component} key={key++} />);

                                if (!page.redirects)
                                    continue;

                                for (const redirect of page.redirects)
                                    routes.push(<ReactRouter.Route path={getPath(redirect)} exact={true} component={() => <Redirect to={getPath(page.path)} />} key={key++} />);
                            }
                            return routes;
                        })()
                    }
                    <ReactRouter.Route component={options.pageNotFound ? options.pageNotFound : () => <h1>404: Page not found</h1>} />
                </Switch>
            </BrowserRouter>
        </div>
    );

    function ContainerizedComponent(props: { container: AppOptions['pageContainer'], page: Page}) {
        if (!props.container)
            return null;
        
        return (
            <props.container page={props.page} />
        );
    }
}

function getPath(path: string) {
    if (path.startsWith('/'))
        return path;

    return `/${path}`;
}